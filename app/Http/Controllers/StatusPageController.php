<?php

namespace App\Http\Controllers;

use App\Models\StatusPage;
use Inertia\Inertia;
use Inertia\Response;

class StatusPageController extends Controller
{
    public function show(string $slug): Response
    {
        $statusPage = StatusPage::where('slug', $slug)
            ->where('is_public', true)
            ->with(['monitors' => function ($query) {
                $query->with(['heartbeats' => function ($q) {
                    $q->latest()->limit(90);
                }, 'incidents' => function ($q) {
                    $q->latest()->limit(10);
                }]);
            }])
            ->firstOrFail();

        $monitors = $statusPage->monitors->map(function ($monitor) {
            $recentHeartbeats = $monitor->heartbeats->take(90);
            $uptime24h = $this->calculateUptime($recentHeartbeats);

            return [
                'id' => $monitor->getKey(),
                'name' => $monitor->name,
                'url' => $monitor->url,
                'status' => $monitor->status,
                'uptime_24h' => $uptime24h,
                'last_checked_at' => $monitor->last_checked_at?->diffForHumans(),
                'heartbeats' => $recentHeartbeats->map(fn ($h) => [
                    'is_up' => $h->is_up,
                    'checked_at' => $h->checked_at->format('Y-m-d H:i'),
                ]),
            ];
        });

        $incidents = $statusPage->monitors->flatMap->incidents->take(10)->map(fn ($i) => [
            'id' => $i->getKey(),
            'monitor_name' => $i->monitor->name,
            'started_at' => $i->started_at->format('Y-m-d H:i:s'),
            'resolved_at' => $i->resolved_at?->format('Y-m-d H:i:s'),
            'error_message' => $i->error_message,
            'duration' => $i->resolved_at ? $i->started_at->diffForHumans($i->resolved_at, true) : null,
        ]);

        return Inertia::render('StatusPage/Show', [
            'statusPage' => [
                'name' => $statusPage->name,
                'description' => $statusPage->description,
                'logo_url' => $statusPage->logo_url,
                'show_uptime' => $statusPage->show_uptime,
                'show_incidents' => $statusPage->show_incidents,
            ],
            'monitors' => $monitors,
            'incidents' => $incidents,
        ]);
    }

    protected function calculateUptime($heartbeats): float
    {
        if ($heartbeats->isEmpty()) {
            return 100.0;
        }

        $upCount = $heartbeats->where('is_up', true)->count();
        return round(($upCount / $heartbeats->count()) * 100, 2);
    }
}
