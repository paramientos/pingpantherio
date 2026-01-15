<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\Monitor;
use Inertia\Inertia;

class WarRoomController extends Controller
{
    public function index()
    {
        $monitors = Monitor::accessibleBy(auth()->user())
            ->with(['heartbeats' => function ($q) {
                $q->latest()->limit(50);
            }])
            ->get()
            ->map(function ($monitor) {
                return [
                    'id' => $monitor->id,
                    'name' => $monitor->name,
                    'status' => $monitor->status, // 'up' or 'down'
                    'last_response_time' => $monitor->heartbeats->first()?->response_time,
                    'last_checked_at' => $monitor->heartbeats->first()?->checked_at?->format('H:i:s'),
                    'history' => $monitor->heartbeats->reverse()->map(fn ($h) => [
                        'time' => $h->checked_at->format('H:i'),
                        'value' => $h->response_time,
                        'up' => $h->is_up,
                    ])->values(),
                ];
            });

        $activeIncidents = Incident::whereIn('monitor_id', $monitors->pluck('id'))
            ->whereNull('resolved_at')
            ->with('monitor')
            ->latest()
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'monitor_name' => $i->monitor->name,
                'started_at' => $i->started_at->diffForHumans(),
                'message' => $i->error_message,
            ]);

        return Inertia::render('WarRoom/Dashboard', [
            'monitors' => $monitors,
            'activeIncidents' => $activeIncidents,
            'stats' => [
                'up_count' => $monitors->where('status', 'up')->count(),
                'down_count' => $monitors->where('status', 'down')->count(),
                'avg_response' => round($monitors->avg('last_response_time'), 2),
            ],
        ]);
    }
}
