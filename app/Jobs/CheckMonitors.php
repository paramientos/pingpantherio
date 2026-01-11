<?php

namespace App\Jobs;

use App\Enums\IncidentStatus;
use App\Enums\MonitorStatus;
use App\Models\Heartbeat;
use App\Models\Incident;
use App\Models\Monitor;
use App\Models\RecoveryAction;
use App\Models\Webhook;
use App\Notifications\IncidentAlert;
use App\Traits\SendsAlerts;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckMonitors implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SendsAlerts;
    use SerializesModels;

    public function __construct(
        protected ?Monitor $monitor = null
    ) {}

    public function handle(): void
    {
        if ($this->monitor) {
            $this->checkMonitor($this->monitor);

            return;
        }

        $monitors = Monitor::whereIn('status', [
            MonitorStatus::UP,
            MonitorStatus::PENDING,
            MonitorStatus::DOWN,
        ])
            ->with(['maintenanceWindows', 'user'])
            ->get();

        foreach ($monitors as $monitor) {
            if ($this->isInMaintenanceWindow($monitor)) {
                continue;
            }

            $this->checkMonitor($monitor);
        }
    }

    protected function isInMaintenanceWindow(Monitor $monitor): bool
    {
        return $monitor->maintenanceWindows()
            ->where('is_active', true)
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now())
            ->exists();
    }

    protected function checkMonitor(Monitor $monitor): void
    {
        $startTime = microtime(true);
        $isUp = false;
        $statusCode = null;
        $responseTime = null;
        $errorMessage = null;

        try {
            $result = match ($monitor->type) {
                'http' => $this->checkHttp($monitor),
                'ping' => $this->checkPing($monitor),
                'port' => $this->checkPort($monitor),
                'keyword' => $this->checkKeyword($monitor),
                'push' => $this->checkPush($monitor),

                default => ['is_up' => false, 'error' => 'Unknown monitor type'],
            };

            $isUp = $result['is_up'];
            $statusCode = $result['status_code'] ?? null;
            $errorMessage = $result['error'] ?? null;
            $metadata = $result['metadata'] ?? null;
            $htmlSnapshot = $result['html_snapshot'] ?? null;
            $responseHeaders = $result['response_headers'] ?? null;
        } catch (\Exception $e) {
            $isUp = false;
            $errorMessage = $e->getMessage();
            $metadata = null;
            $htmlSnapshot = null;
            $responseHeaders = null;
        }

        $responseTime = (microtime(true) - $startTime) * 1000;

        Heartbeat::create([
            'monitor_id' => $monitor->getKey(),
            'is_up' => $isUp,
            'response_time' => $responseTime,
            'status_code' => $statusCode,
            'metadata' => $metadata,
            'checked_at' => now(),
        ]);

        $previousStatus = $monitor->status;

        $monitor->update([
            'last_checked_at' => now(),
            'status' => $isUp ? MonitorStatus::UP : MonitorStatus::DOWN,
            'metadata' => $metadata,
        ]);

        $statusValue = $previousStatus instanceof MonitorStatus ? $previousStatus->value : $previousStatus;

        if (! $isUp && ($statusValue === MonitorStatus::UP->value || $statusValue === MonitorStatus::PENDING->value || $statusValue === null)) {
            Log::info("Monitor {$monitor->name} is DOWN. Creating incident.");
            $this->createIncident($monitor, $errorMessage, [
                'html_snapshot' => $htmlSnapshot,
                'response_headers' => $responseHeaders,
            ]);
        } elseif ($isUp && $statusValue === MonitorStatus::DOWN->value) {
            Log::info("Monitor {$monitor->name} is UP. Resolving incident.");
            $this->resolveIncident($monitor);
        }
    }

    protected function checkPush(Monitor $monitor): array
    {
        if (! $monitor->last_ping_at) {
            $isUp = $monitor->created_at->diffInMinutes(now()) <= $monitor->grace_period;

            return [
                'is_up' => $isUp,
                'error' => ! $isUp ? 'Heartbeat never received' : null,
            ];
        }

        $isUp = $monitor->last_ping_at->diffInMinutes(now()) <= $monitor->grace_period;

        return [
            'is_up' => $isUp,
            'error' => ! $isUp ? "No heartbeat received in the last {$monitor->grace_period} minutes" : null,
        ];
    }

    protected function checkHttp(Monitor $monitor): array
    {
        $timeout = $monitor->timeout ?? 30;
        $method = $monitor->method ?? 'GET';
        $headers = $monitor->headers ?? [];

        try {
            $response = Http::timeout($timeout)
                ->withHeaders($headers)
                ->withOptions(['verify' => $monitor->verify_ssl ?? true])
                ->{strtolower($method)}($monitor->url);

            $metadata = [
                'server' => $response->header('Server'),
                'content_type' => $response->header('Content-Type'),
                'content_length' => $response->header('Content-Length'),
                'ip_address' => gethostbyname(parse_url($monitor->url, PHP_URL_HOST)),
                'response_headers' => $response->headers(),
            ];

            $statusCode = $response->status();
            $isUp = $response->successful(); // 2xx status codes
            $errorMessage = null;

            if (! $isUp) {
                $errorMessage = $this->getHttpErrorMessage($statusCode, $response);
            }

            return [
                'is_up' => $isUp,
                'status_code' => $statusCode,
                'error' => $errorMessage,
                'metadata' => $metadata,
                'html_snapshot' => ! $isUp ? $response->body() : null,
                'response_headers' => $response->headers(),
            ];
        } catch (ConnectionException $e) {
            return [
                'is_up' => false,
                'status_code' => null,
                'error' => $this->parseConnectionError($e->getMessage()),
                'metadata' => null,
                'html_snapshot' => null,
                'response_headers' => null,
            ];
        } catch (\Exception $e) {
            return [
                'is_up' => false,
                'status_code' => null,
                'error' => 'Unexpected error: '.$e->getMessage(),
                'metadata' => null,
                'html_snapshot' => null,
                'response_headers' => null,
            ];
        }
    }

    protected function getHttpErrorMessage(int $statusCode, $response): string
    {
        return match (true) {
            $statusCode === 400 => 'Bad Request (400) - The server cannot process the request',
            $statusCode === 401 => 'Unauthorized (401) - Authentication required',
            $statusCode === 403 => 'Forbidden (403) - Access denied to this resource',
            $statusCode === 404 => 'Not Found (404) - The requested page does not exist',
            $statusCode === 405 => 'Method Not Allowed (405) - HTTP method not supported',
            $statusCode === 408 => 'Request Timeout (408) - Server took too long to respond',
            $statusCode === 429 => 'Too Many Requests (429) - Rate limit exceeded',
            $statusCode === 500 => 'Internal Server Error (500) - The server encountered an error',
            $statusCode === 502 => 'Bad Gateway (502) - Invalid response from upstream server',
            $statusCode === 503 => 'Service Unavailable (503) - Server is temporarily down',
            $statusCode === 504 => 'Gateway Timeout (504) - Upstream server did not respond in time',
            $statusCode >= 400 && $statusCode < 500 => "Client Error ({$statusCode}) - Request cannot be fulfilled",
            $statusCode >= 500 => "Server Error ({$statusCode}) - The server is experiencing issues",
            default => "HTTP {$statusCode} - Unexpected response code",
        };
    }

    protected function parseConnectionError(string $error): string
    {
        return match (true) {
            str_contains($error, 'Could not resolve host') => 'DNS Error - Domain name could not be resolved. The website may not exist or DNS is misconfigured.',
            str_contains($error, 'Connection timed out') => 'Connection Timeout - Server did not respond within the timeout period. The server may be down or overloaded.',
            str_contains($error, 'Connection refused') => 'Connection Refused - The server actively refused the connection. The service may be stopped or blocked.',
            str_contains($error, 'SSL certificate problem') => 'SSL Certificate Error - The SSL/TLS certificate is invalid, expired, or untrusted.',
            str_contains($error, 'SSL: certificate verification failed') => 'SSL Verification Failed - The SSL certificate could not be verified.',
            str_contains($error, 'Operation timed out') => 'Operation Timeout - The request took too long to complete.',
            str_contains($error, 'Failed to connect') => 'Connection Failed - Unable to establish a connection to the server.',
            str_contains($error, 'Name or service not known') => 'DNS Error - The domain name is unknown or cannot be found.',
            str_contains($error, 'No route to host') => 'Network Error - No network route to the host. The server may be unreachable.',
            default => 'Connection Error - '.$error,
        };
    }

    protected function checkPing(Monitor $monitor): array
    {
        $host = parse_url($monitor->url, PHP_URL_HOST) ?? $monitor->url;
        $timeout = $monitor->timeout ?? 30;

        $command = PHP_OS_FAMILY === 'Windows'
            ? "ping -n 1 -w {$timeout}000 {$host}"
            : "ping -c 1 -W {$timeout} {$host}";

        exec($command, $output, $returnCode);

        return [
            'is_up' => $returnCode === 0,
            'error' => $returnCode !== 0 ? 'Ping failed' : null,
        ];
    }

    protected function checkPort(Monitor $monitor): array
    {
        $host = parse_url($monitor->url, PHP_URL_HOST) ?? $monitor->url;
        $port = $monitor->port ?? 80;
        $timeout = $monitor->timeout ?? 30;

        $connection = @fsockopen($host, $port, $errno, $errstr, $timeout);

        if ($connection) {
            fclose($connection);

            return ['is_up' => true];
        }

        return [
            'is_up' => false,
            'error' => "Port {$port} is closed: {$errstr}",
        ];
    }

    protected function checkKeyword(Monitor $monitor): array
    {
        $timeout = $monitor->timeout ?? 30;
        $keyword = $monitor->keyword;

        $response = Http::timeout($timeout)
            ->withOptions(['verify' => $monitor->verify_ssl ?? true])
            ->get($monitor->url);

        if (! $response->successful()) {
            return [
                'is_up' => false,
                'status_code' => $response->status(),
                'error' => "HTTP {$response->status()}",
            ];
        }

        $containsKeyword = str_contains($response->body(), $keyword);

        return [
            'is_up' => $containsKeyword,
            'status_code' => $response->status(),
            'error' => ! $containsKeyword ? "Keyword '{$keyword}' not found" : null,
            'html_snapshot' => ! $containsKeyword ? $response->body() : null,
            'response_headers' => $response->headers(),
        ];
    }

    protected function createIncident(Monitor $monitor, ?string $errorMessage, array $snapshot = []): void
    {
        $lastIncident = Incident::where('monitor_id', $monitor->getKey())
            ->whereNull('resolved_at')
            ->latest()
            ->first();

        if (! $lastIncident) {
            $incident = Incident::create([
                'monitor_id' => $monitor->getKey(),
                'title' => 'Monitor Down: '.$monitor->name,
                'started_at' => now(),
                'status' => IncidentStatus::OPEN,
                'error_message' => $errorMessage,
                'html_snapshot' => $snapshot['html_snapshot'] ?? null,
                'response_headers' => $snapshot['response_headers'] ?? null,
                'screenshot_path' => $this->takeScreenshot($monitor->url),
            ]);

            if ($monitor->escalation_policy_id) {
                dispatch(new \App\Jobs\ProcessEscalationStep($incident, 0));
            } elseif ($monitor->user) {
                $monitor->user->notify(new IncidentAlert($monitor, $incident, 'started'));
            }

            $this->triggerWebhooks($monitor->user, 'incident.started', [
                'monitor' => $monitor->only(['id', 'name', 'url', 'type']),
                'incident' => $incident->only(['id', 'started_at', 'error_message']),
            ]);

            $this->triggerRecoveryActions($monitor, $incident);
        }
    }

    protected function triggerRecoveryActions($monitor, $incident): void
    {
        $actions = RecoveryAction::where('monitor_id', $monitor->id)
            ->where('is_active', true)
            ->get();

        foreach ($actions as $action) {
            dispatch(new \App\Jobs\ExecuteRecoveryAction($action, $incident->id))
                ->delay(now()->addSeconds($action->delay_seconds));
        }
    }

    protected function triggerWebhooks($user, string $event, array $payload): void
    {
        $webhooks = Webhook::where('user_id', $user->id)
            ->where('is_active', true)
            ->get();

        foreach ($webhooks as $webhook) {
            if (in_array($event, $webhook->events)) {
                dispatch(new DispatchWebhook($webhook, $event, $payload));
            }
        }
    }

    protected function resolveIncident(Monitor $monitor): void
    {
        $incident = Incident::where('monitor_id', $monitor->getKey())
            ->whereNull('resolved_at')
            ->latest()
            ->first();

        if ($incident) {
            $incident->update([
                'resolved_at' => now(),
                'status' => IncidentStatus::RESOLVED,
            ]);

            if ($monitor->escalation_policy_id && $monitor->escalationPolicy) {
                $channels = $monitor->escalationPolicy->rules->map(fn ($r) => $r->channel)->unique('id');
                foreach ($channels as $channel) {
                    if ($channel && $channel->is_active) {
                        $this->notifyChannelResolved($channel, $monitor, $incident);
                    }
                }
            } else {
                $monitor->user->notify(new IncidentAlert($monitor, $incident, 'resolved'));
            }

            $this->triggerWebhooks($monitor->user, 'incident.resolved', [
                'monitor' => $monitor->only(['id', 'name', 'url', 'type']),
                'incident' => $incident->only(['id', 'started_at', 'resolved_at']),
            ]);
        }
    }

    protected function notifyChannelResolved($channel, $monitor, $incident): void
    {
        $this->sendAlertToChannel($channel, $monitor, $incident, 'resolved');
    }

    protected function takeScreenshot(string $url): ?string
    {
        try {
            $apiUrl = 'https://api.screenshotmachine.com/?key=FREE&url='.urlencode($url).'&dimension=1024x768';

            return $apiUrl;
        } catch (\Exception $e) {
            Log::error('Failed to take screenshot: '.$e->getMessage());

            return null;
        }
    }
}
