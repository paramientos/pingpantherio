<?php

namespace App\Http\Controllers;

use App\Enums\MonitorStatus;
use App\Models\Monitor;
use App\Models\Heartbeat;
use App\Models\Incident;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $monitors = Monitor::where('user_id', auth()->id())->get();

        $stats = [
            'uptime_24h' => $this->calculateGlobalUptime(24),
            'avg_response' => floor(Heartbeat::whereIn('monitor_id', $monitors->pluck('id'))
                ->where('checked_at', '>=', now()->subHours(24))
                ->avg('response_time')),

            'active_monitors' => $monitors->where('status', MonitorStatus::UP)->count(),

            'incidents' => Incident::whereIn('monitor_id', $monitors->pluck('id'))
                ->whereNull('resolved_at')
                ->count(),
        ];

        $uptimeData = $this->getUptimeChartData($monitors, 24);
        $responseTimeData = $this->getResponseTimeChartData($monitors, 24);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'uptimeData' => $uptimeData,
            'responseTimeData' => $responseTimeData,
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
}
