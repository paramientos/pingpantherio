<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(): Response
    {
        $reports = Report::where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn ($report) => [
                'id' => $report->getKey(),
                'name' => $report->name,
                'type' => $report->type,
                'frequency' => $report->frequency,
                'is_active' => $report->is_active,
                'last_sent_at' => $report->last_sent_at?->format('M d, Y H:i'),
                'next_send_at' => $report->next_send_at?->format('M d, Y H:i'),
            ]);

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
        ]);
    }

    public function create(): Response
    {
        $user = auth()->user();
        $query = Monitor::query();

        if ($user->role !== \App\Enums\Role::ADMIN && $user->teams()->exists()) {
            $teamIds = $user->teams()->pluck('teams.id');
            $query->whereHas('teams', function ($q) use ($teamIds) {
                $q->whereIn('teams.id', $teamIds);
            });
        } elseif ($user->role !== \App\Enums\Role::ADMIN) {
            $query->where('user_id', $user->id);
        }

        $monitors = $query->get()
            ->map(fn ($m) => [
                'value' => $m->getKey(),
                'label' => $m->name,
            ]);

        return Inertia::render('Reports/Create', [
            'monitors' => $monitors,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeWrite();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:uptime,response_time,slas',
            'frequency' => 'required|in:daily,weekly,monthly',
            'monitor_ids' => 'required|array|min:1',
            'recipients' => 'required|array|min:1',
            'recipients.*' => 'email',
            'is_active' => 'boolean',
        ]);

         Report::create([
            ...$validated,
            'user_id' => auth()->id(),
            'next_send_at' => now()->addDay(),
        ]);

        return redirect()->route('reports.index')
            ->with('message', 'Automatic report scheduled successfully');
    }

    public function destroy(Report $report)
    {
        $report->delete();
        return redirect()->route('reports.index');
    }

    public function analytics(Request $request): Response
    {
        $period = $request->get('period', '30'); // days
        $monitorId = $request->get('monitor_id');

        $query = Monitor::where('user_id', auth()->user()->id);

        if ($monitorId) {
            $query->where('id', $monitorId);
        }

        $monitors = $query->with(['heartbeats' => function ($q) use ($period) {
            $q->where('checked_at', '>=', now()->subDays($period));
        }, 'incidents' => function ($q) use ($period) {
            $q->where('started_at', '>=', now()->subDays($period));
        }])->get();

        $analytics = $monitors->map(function ($monitor) use ($period) {
            $heartbeats = $monitor->heartbeats;
            $incidents = $monitor->incidents;

            $totalChecks = $heartbeats->count();
            $successfulChecks = $heartbeats->where('is_up', true)->count();
            $uptime = $totalChecks > 0 ? round(($successfulChecks / $totalChecks) * 100, 2) : 100;

            $avgResponseTime = $heartbeats->avg('response_time');
            $maxResponseTime = $heartbeats->max('response_time');
            $minResponseTime = $heartbeats->min('response_time');

            $totalDowntime = $incidents->sum(function ($incident) {
                $end = $incident->resolved_at ?? now();
                return $incident->started_at->diffInMinutes($end);
            });

            return [
                'monitor_id' => $monitor->id,
                'monitor_name' => $monitor->name,
                'monitor_url' => $monitor->url,
                'uptime_percentage' => $uptime,
                'total_checks' => $totalChecks,
                'successful_checks' => $successfulChecks,
                'failed_checks' => $totalChecks - $successfulChecks,
                'avg_response_time' => round($avgResponseTime, 2),
                'max_response_time' => round($maxResponseTime, 2),
                'min_response_time' => round($minResponseTime, 2),
                'total_incidents' => $incidents->count(),
                'total_downtime_minutes' => $totalDowntime,
                'total_downtime_hours' => round($totalDowntime / 60, 2),
            ];
        });

        $allMonitors = Monitor::where('user_id', auth()->user()->id)->get()->map(fn ($m) => [
            'value' => $m->id,
            'label' => $m->name,
        ]);

        return Inertia::render('Reports/Analytics', [
            'analytics' => $analytics,
            'period' => $period,
            'selectedMonitor' => $monitorId,
            'monitors' => $allMonitors,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $period = $request->get('period', '30');
        $monitorId = $request->get('monitor_id');

        $query = Monitor::where('user_id', auth()->user()->id);

        if ($monitorId) {
            $query->where('id', $monitorId);
        }

        $monitors = $query->with(['heartbeats' => function ($q) use ($period) {
            $q->where('checked_at', '>=', now()->subDays($period));
        }, 'incidents' => function ($q) use ($period) {
            $q->where('started_at', '>=', now()->subDays($period));
        }])->get();

        $analytics = $monitors->map(function ($monitor) use ($period) {
            $heartbeats = $monitor->heartbeats;
            $incidents = $monitor->incidents;

            $totalChecks = $heartbeats->count();
            $successfulChecks = $heartbeats->where('is_up', true)->count();
            $uptime = $totalChecks > 0 ? round(($successfulChecks / $totalChecks) * 100, 2) : 100;

            $avgResponseTime = $heartbeats->avg('response_time');
            $totalDowntime = $incidents->sum(function ($incident) {
                $end = $incident->resolved_at ?? now();
                return $incident->started_at->diffInMinutes($end);
            });

            return [
                'monitor_name' => $monitor->name,
                'monitor_url' => $monitor->url,
                'uptime_percentage' => $uptime,
                'total_checks' => $totalChecks,
                'successful_checks' => $successfulChecks,
                'failed_checks' => $totalChecks - $successfulChecks,
                'avg_response_time' => round($avgResponseTime, 2),
                'total_incidents' => $incidents->count(),
                'total_downtime_hours' => round($totalDowntime / 60, 2),
            ];
        });

        $pdf = Pdf::loadView('reports.pdf', [
            'analytics' => $analytics,
            'period' => $period,
            'generated_at' => now()->format('M d, Y H:i'),
            'user' => auth()->user(),
        ]);

        return $pdf->download('pingpanther-report-' . now()->format('Y-m-d') . '.pdf');
    }
}
