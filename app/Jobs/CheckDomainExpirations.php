<?php

namespace App\Jobs;

use App\Models\DomainMonitor;
use App\Notifications\DomainExpiryAlert;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Iodev\Whois\Factory;

class CheckDomainExpirations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private ?DomainMonitor $domainMonitor = null)
    {
        //
    }

    public function handle(): void
    {
        if ($this->domainMonitor) {
            $this->processDomain($this->domainMonitor);

            return;
        }

        DomainMonitor::where('is_active', true)->chunk(50, function ($domains) {
            foreach ($domains as $domain) {
                $this->processDomain($domain);
            }
        });
    }

    protected function processDomain(DomainMonitor $domainMonitor): void
    {
        try {
            $whois = Factory::get()->createWhois();
            $info = $whois->loadDomainInfo($domainMonitor->domain);

            if ($info) {
                $this->updateDomainInfo($domainMonitor, [
                    'expires_at' => $info->expirationDate ? Carbon::createFromTimestamp($info->expirationDate) : null,
                    'registrar' => $info->registrar,
                    'nameservers' => $info->nameservers,
                    'creation_date' => $info->creationDate,
                ]);

                return;
            }
        } catch (\Exception $e) {
            Log::warning("WHOIS Port 43 unreachable for {$domainMonitor->domain}, falling back to RDAP (HTTPS)...");
        }

        $this->processRdapFallback($domainMonitor);
    }

    protected function processRdapFallback(DomainMonitor $domainMonitor): void
    {
        try {
            $response = Http::timeout(5)->get("https://rdap.org/domain/{$domainMonitor->domain}");

            if ($response->successful()) {
                $data = $response->json();
                $expirationDate = null;
                $registrar = 'Unknown';

                foreach ($data['events'] ?? [] as $event) {
                    if ($event['eventAction'] === 'expiration') {
                        $expirationDate = Carbon::parse($event['eventDate']);
                    }
                }

                foreach ($data['entities'] ?? [] as $entity) {
                    if (in_array('registrar', $entity['roles'] ?? [])) {
                        $registrar = $entity['vcardArray'][1][1][3] ?? 'Unknown';
                    }
                }

                $this->updateDomainInfo($domainMonitor, [
                    'expires_at' => $expirationDate,
                    'registrar' => $registrar,
                    'nameservers' => array_map(fn ($ns) => $ns['ldhName'], $data['nameservers'] ?? []),
                    'creation_date' => null,
                ]);
            }
        } catch (\Exception $e) {
            Log::error("All WHOIS/RDAP methods failed for {$domainMonitor->domain}: ".$e->getMessage());
        }
    }

    protected function updateDomainInfo(DomainMonitor $domain, array $data): void
    {
        $domain->update([
            'expires_at' => $data['expires_at'],
            'last_checked_at' => now(),
            'whois_data' => [
                'registrar' => $data['registrar'],
                'nameservers' => $data['nameservers'],
                'creation_date' => $data['creation_date'],
                'method' => isset($data['creation_date']) ? 'whois_socket' : 'rdap_https',
            ],
        ]);

        $this->checkAndNotify($domain);
    }

    protected function checkAndNotify(DomainMonitor $domain): void
    {
        if (! $domain->expires_at || ! $domain->user) {
            return;
        }

        $daysLeft = (int) now()->diffInDays($domain->expires_at, false);

        if (in_array($daysLeft, [30, 15, 7, 3, 1, 0])) {
            $domain->user->notify(new DomainExpiryAlert($domain, $daysLeft));
        }
    }
}
