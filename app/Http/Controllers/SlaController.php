<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use App\Models\SlaConfig;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SlaController extends Controller
{
    public function index(): Response
    {
        $slas = SlaConfig::with('monitor')
            ->whereHas('monitor', fn($q) => $q->where('user_id', auth()->user()->id))
            ->where('is_active', true)
            ->get()
            ->map(function ($sla) {
                $currentUptime = $sla->calculateCurrentUptime();
                $currentDowntime = $sla->calculateCurrentDowntime();
                $isCompliant = $sla->isCompliant();

                return [
                    'id' => $sla->id,
                    'name' => $sla->name,
                    'monitor_name' => $sla->monitor->name,
                    'monitor_id' => $sla->monitor->id,
                    'uptime_target' => $sla->uptime_target,
                    'current_uptime' => $currentUptime,
                    'max_downtime_minutes' => $sla->max_downtime_minutes_monthly,
                    'current_downtime_minutes' => $currentDowntime,
                    'period' => $sla->period,
                    'is_compliant' => $isCompliant,
                    'compliance_percentage' => $isCompliant ? 100 : round(($currentUptime / $sla->uptime_target) * 100, 2),
                ];
            });

        $monitors = Monitor::where('user_id', auth()->user()->id)
            ->whereDoesntHave('slaConfig')
            ->get()
            ->map(fn ($m) => [
                'value' => $m->id,
                'label' => $m->name,
            ]);

        return Inertia::render('Sla/Index', [
            'slas' => $slas,
            'monitors' => $monitors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'monitor_id' => 'required|exists:monitors,id',
            'name' => 'required|string|max:255',
            'uptime_target' => 'required|numeric|min:0|max:100',
            'max_downtime_minutes_monthly' => 'nullable|integer|min:0',
            'response_time_target' => 'nullable|numeric|min:0',
            'period' => 'required|in:daily,weekly,monthly',
        ]);

        SlaConfig::create($validated);

        return back()->with('success', 'SLA configuration created.');
    }

    public function destroy(SlaConfig $slaConfig)
    {
        // Check ownership
        if ($slaConfig->monitor->user_id !== auth()->user()->id) {
            abort(403);
        }

        $slaConfig->delete();

        return back()->with('success', 'SLA configuration deleted.');
    }
}
