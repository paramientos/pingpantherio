<?php

namespace App\Jobs;

use App\Enums\IncidentStatus;
use App\Enums\MonitorStatus;
use App\Models\Heartbeat;
use App\Models\Incident;
use App\Models\Monitor;
use App\Notifications\IncidentAlert;
use App\Traits\SendsAlerts;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
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
        // Eğer hiç ping gelmemişse ve monitor yeni oluşturulmuşsa
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

        return [
            'is_up' => $response->successful(),
            'status_code' => $response->status(),
            'error' => $response->failed() ? "HTTP {$response->status()}" : null,
            'metadata' => $metadata,
            'html_snapshot' => $response->failed() ? $response->body() : null,
            'response_headers' => $response->headers(),
        ];
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

            // Webhook Tetikle
            $this->triggerWebhooks($monitor->user, 'incident.started', [
                'monitor' => $monitor->only(['id', 'name', 'url', 'type']),
                'incident' => $incident->only(['id', 'started_at', 'error_message']),
            ]);

            // Self-healing: Otomatik Kurtarma Eylemlerini Tetikle
            $this->triggerRecoveryActions($monitor, $incident);
        }
    }

    protected function triggerRecoveryActions($monitor, $incident): void
    {
        $actions = \App\Models\RecoveryAction::where('monitor_id', $monitor->id)
            ->where('is_active', true)
            ->get();

        foreach ($actions as $action) {
            dispatch(new \App\Jobs\ExecuteRecoveryAction($action, $incident->id))
                ->delay(now()->addSeconds($action->delay_seconds));
        }
    }

    protected function triggerWebhooks($user, string $event, array $payload): void
    {
        $webhooks = \App\Models\Webhook::where('user_id', $user->id)
            ->where('is_active', true)
            ->get();

        foreach ($webhooks as $webhook) {
            if (in_array($event, $webhook->events)) {
                dispatch(new \App\Jobs\DispatchWebhook($webhook, $event, $payload));
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

            // Webhook Tetikle
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
            // Using a free screenshot API for demo purposes
            // In a real production environment, you would use spatie/browsershot (Puppeteer)
            $apiUrl = 'https://api.screenshotmachine.com/?key=FREE&url='.urlencode($url).'&dimension=1024x768';

            // We return the external URL as the screenshot path for now.
            // In production, we would download it to storage/private and return the local path.
            return $apiUrl;
        } catch (\Exception $e) {
            Log::error('Failed to take screenshot: '.$e->getMessage());

            return null;
        }
    }
}
