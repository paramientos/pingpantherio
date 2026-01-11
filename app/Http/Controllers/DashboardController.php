<?php

namespace App\Http\Controllers;

use App\Enums\MonitorStatus;
use App\Models\Heartbeat;
use App\Models\Incident;
use App\Models\Monitor;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $monitors = Monitor::where('user_id', auth()->id())->get();

        $stats = [
            'uptime_24h' => $this->calculateGlobalUptime(24),
            'uptime_7d' => $this->calculateGlobalUptime(168),
            'avg_response' => floor(Heartbeat::whereIn('monitor_id', $monitors->pluck('id'))
                ->where('checked_at', '>=', now()->subHours(24))
                ->avg('response_time')),

            'active_monitors' => $monitors->where('status', MonitorStatus::UP)->count(),
            'total_monitors' => $monitors->count(),
            'down_monitors' => $monitors->where('status', MonitorStatus::DOWN)->count(),
            'pending_monitors' => $monitors->where('status', MonitorStatus::PENDING)->count(),

            'incidents' => Incident::whereIn('monitor_id', $monitors->pluck('id'))
                ->whereNull('resolved_at')
                ->count(),
            'incidents_24h' => Incident::whereIn('monitor_id', $monitors->pluck('id'))
                ->where('started_at', '>=', now()->subHours(24))
                ->count(),
            'incidents_7d' => Incident::whereIn('monitor_id', $monitors->pluck('id'))
                ->where('started_at', '>=', now()->subDays(7))
                ->count(),
        ];

        $uptimeData = $this->getUptimeChartData($monitors, 24);
        $responseTimeData = $this->getResponseTimeChartData($monitors, 24);
        $monitorDistribution = $this->getMonitorDistribution($monitors);
        $incidentTimeline = $this->getIncidentTimeline($monitors, 7);
        $slowestMonitors = $this->getSlowestMonitors($monitors);
        $recentIncidents = $this->getRecentIncidents($monitors);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'uptimeData' => $uptimeData,
            'responseTimeData' => $responseTimeData,
            'monitorDistribution' => $monitorDistribution,
            'incidentTimeline' => $incidentTimeline,
            'slowestMonitors' => $slowestMonitors,
            'recentIncidents' => $recentIncidents,
        ]);
    }

    protected function calculateGlobalUptime(int $hours): float
    {
        $monitors = Monitor::where('user_id', auth()->id())->get();

        if ($monitors->isEmpty()) {
            return 100.0;
        }

        $totalUptime = 0;
        foreach ($monitors as $monitor) {
            $heartbeats = $monitor->heartbeats()
                ->where('checked_at', '>=', now()->subHours($hours))
                ->get();

            if ($heartbeats->isEmpty()) {
                $totalUptime += 100;

                continue;
            }

            $upCount = $heartbeats->where('is_up', true)->count();
            $totalCount = $heartbeats->count();
            $totalUptime += ($upCount / $totalCount) * 100;
        }

        return round($totalUptime / $monitors->count(), 2);
    }

    protected function getUptimeChartData($monitors, int $hours): array
    {
        $data = [];

        for ($i = $hours - 1; $i >= 0; $i--) {
            $hourStart = now()->subHours($i)->startOfHour();
            $hourEnd = $hourStart->copy()->endOfHour();

            $heartbeats = Heartbeat::whereIn('monitor_id', $monitors->pluck('id'))
                ->whereBetween('checked_at', [$hourStart, $hourEnd])
                ->get();

            $uptime = 100;
            if ($heartbeats->isNotEmpty()) {
                $upCount = $heartbeats->where('is_up', true)->count();
                $uptime = round(($upCount / $heartbeats->count()) * 100, 2);
            }

            $data[] = [
                'time' => $hourStart->format('H:00'),
                'uptime' => $uptime,
            ];
        }

        return $data;
    }

    protected function getResponseTimeChartData($monitors, int $hours): array
    {
        $data = [];

        for ($i = $hours - 1; $i >= 0; $i--) {
            $hourStart = now()->subHours($i)->startOfHour();
            $hourEnd = $hourStart->copy()->endOfHour();

            $avgResponse = Heartbeat::whereIn('monitor_id', $monitors->pluck('id'))
                ->whereBetween('checked_at', [$hourStart, $hourEnd])
                ->avg('response_time');

            $data[] = [
                'time' => $hourStart->format('H:00'),
                'response' => round($avgResponse ?? 0, 2),
            ];
        }

        return $data;
    }

    protected function getMonitorDistribution($monitors): array
    {
        return [
            ['name' => 'Up', 'value' => $monitors->where('status', MonitorStatus::UP)->count(), 'color' => '#51cf66'],
            ['name' => 'Down', 'value' => $monitors->where('status', MonitorStatus::DOWN)->count(), 'color' => '#ff6b6b'],
            ['name' => 'Pending', 'value' => $monitors->where('status', MonitorStatus::PENDING)->count(), 'color' => '#ffd43b'],
        ];
    }

    protected function getIncidentTimeline($monitors, int $days): array
    {
        $data = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->startOfDay();
            $count = Incident::whereIn('monitor_id', $monitors->pluck('id'))
                ->whereDate('started_at', $date)
                ->count();

            $data[] = [
                'date' => $date->format('M d'),
                'incidents' => $count,
            ];
        }

        return $data;
    }

    protected function getSlowestMonitors($monitors): array
    {
        return $monitors->map(function ($monitor) {
            $avgResponse = Heartbeat::where('monitor_id', $monitor->id)
                ->where('checked_at', '>=', now()->subHours(24))
                ->avg('response_time');

            return [
                'name' => $monitor->name,
                'response_time' => round($avgResponse ?? 0, 2),
            ];
        })
            ->sortByDesc('response_time')
            ->take(5)
            ->values()
            ->toArray();
    }

    protected function getRecentIncidents($monitors): array
    {
        return Incident::whereIn('monitor_id', $monitors->pluck('id'))
            ->with('monitor')
            ->latest('started_at')
            ->limit(5)
            ->get()
            ->map(fn ($incident) => [
                'id' => $incident->id,
                'monitor_name' => $incident->monitor->name,
                'error' => $incident->error_message,
                'started_at' => $incident->started_at->diffForHumans(),
                'resolved_at' => $incident->resolved_at?->diffForHumans(),
                'is_resolved' => $incident->resolved_at !== null,
            ])
            ->toArray();
    }
}
