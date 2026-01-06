<?php

namespace App\Jobs;

use App\Models\DomainMonitor;
use App\Models\Monitor;
use App\Notifications\SslExpiryAlert;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckSslCertificates implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(private ?Monitor $monitor = null)
    {
        //
    }

    public function handle(): void
    {
        if ($this->monitor) {
            $this->checkSslCertificate($this->monitor);

            return;
        }

        $monitors = Monitor::where('check_ssl', true)
            ->where('type', 'http')
            ->get();

        foreach ($monitors as $monitor) {
            $this->checkSslCertificate($monitor);
        }
    }

    protected function checkSslCertificate(Monitor $monitor): void
    {
        try {
            $url = parse_url($monitor->url);
            $host = $url['host'] ?? $monitor->url;
            $port = $url['port'] ?? 443;

            $context = stream_context_create([
                'ssl' => [
                    'capture_peer_cert' => true,
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ]);

            $stream = @stream_socket_client(
                "ssl://{$host}:{$port}",
                $errno,
                $errstr,
                30,
                STREAM_CLIENT_CONNECT,
                $context
            );

            if (!$stream) {
                return;
            }

            $params = stream_context_get_params($stream);
            $cert = openssl_x509_parse($params['options']['ssl']['peer_certificate']);

            if ($cert) {
                $expiryDate = \Carbon\Carbon::createFromTimestamp($cert['validTo_time_t']);
                $daysUntilExpiry = now()->diffInDays($expiryDate, false);

                $monitor->update([
                    'ssl_expires_at' => $expiryDate,
                    'ssl_days_until_expiry' => (int)$daysUntilExpiry,
                    'ssl_issuer' => $cert['issuer']['O'] ?? $cert['issuer']['CN'] ?? 'Unknown',
                ]);

                if ($daysUntilExpiry <= 30 && $daysUntilExpiry > 0) {
                    $monitor->user->notify(new SslExpiryAlert($monitor, $daysUntilExpiry));
                }
            }

            fclose($stream);
        } catch (\Exception $e) {
            \Log::error("SSL check failed for {$monitor->name}: {$e->getMessage()}");
        }
    }
}
