<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\Monitor;
use Inertia\Inertia;
use Inertia\Response;

class IncidentController extends Controller
{
    public function index(): Response
    {
        $monitors = Monitor::where('user_id', auth()->id())->get();

        $incidents = Incident::whereIn('monitor_id', $monitors->pluck('id'))
            ->with('monitor')
            ->latest('started_at')
            ->paginate(50)
            ->through(fn ($incident) => [
                'id' => $incident->getKey(),
                'monitor_id' => $incident->monitor_id,
                'monitor_name' => $incident->monitor->name,
                'monitor_url' => $incident->monitor->url,
                'error_message' => $incident->error_message,
                'started_at' => $incident->started_at->format('Y-m-d H:i:s'),
                'resolved_at' => $incident->resolved_at?->format('Y-m-d H:i:s'),
                'duration' => $incident->resolved_at
                    ? $incident->started_at->diffForHumans($incident->resolved_at, true)
                    : $incident->started_at->diffForHumans(),
                'is_active' => $incident->resolved_at === null,
            ]);

        $stats = [
            'total' => Incident::whereIn('monitor_id', $monitors->pluck('id'))->count(),

            'active' => Incident::whereIn('monitor_id', $monitors->pluck('id'))
                ->whereNull('resolved_at')
                ->count(),

            'resolved_today' => Incident::whereIn('monitor_id', $monitors->pluck('id'))
                ->whereNotNull('resolved_at')
                ->whereDate('resolved_at', today())
                ->count(),

            'avg_resolution_time' => $this->calculateAvgResolutionTime($monitors),
        ];

        return Inertia::render('Incidents/Index', [
            'incidents' => $incidents,
            'stats' => $stats,
        ]);
    }

    protected function calculateAvgResolutionTime($monitors): string
    {
        $resolved = Incident::whereIn('monitor_id', $monitors->pluck('id'))
            ->whereNotNull('resolved_at')
            ->get();

        if ($resolved->isEmpty()) {
            return 'N/A';
        }

        $totalSeconds = 0;
        
        foreach ($resolved as $incident) {
            $totalSeconds += $incident->started_at->diffInSeconds($incident->resolved_at);
        }

        $avgSeconds = $totalSeconds / $resolved->count();
        $minutes = floor($avgSeconds / 60);

        if ($minutes < 60) {
            return "{$minutes} min";
        }

        $hours = floor($minutes / 60);

        return "{$hours}h ".($minutes % 60).'m';
    }
}
