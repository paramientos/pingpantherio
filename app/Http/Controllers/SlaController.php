<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use App\Models\SlaConfig;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use \Symfony\Component\HttpFoundation\Response as HttpResponse;

class SlaController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $monitorQuery = Monitor::query();

        if ($user->role !== \App\Enums\Role::ADMIN && $user->teams()->exists()) {
            $teamIds = $user->teams()->pluck('teams.id');
            $monitorQuery->whereHas('teams', function ($q) use ($teamIds) {
                $q->whereIn('teams.id', $teamIds);
            });
        } elseif ($user->role !== \App\Enums\Role::ADMIN) {
            $monitorQuery->where('user_id', $user->id);
        }

        $monitorIds = $monitorQuery->pluck('id');

        $slas = SlaConfig::with('monitor')
            ->whereIn('monitor_id', $monitorIds)
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

        $monitors = Monitor::query()
            ->when($user->role !== \App\Enums\Role::ADMIN && $user->teams()->exists(), function ($q) use ($teamIds) {
                $q->whereHas('teams', function ($subQ) use ($teamIds) {
                    $subQ->whereIn('teams.id', $teamIds);
                });
            })
            ->when($user->role !== \App\Enums\Role::ADMIN && !$user->teams()->exists(), function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
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
        $this->authorizeWrite();

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
        $this->authorizeWrite();

        // Check ownership
        if ($slaConfig->monitor->user_id !== auth()->user()->id) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to delete this SLA configuration.');
        }

        $slaConfig->delete();

        return back()->with('success', 'SLA configuration deleted.');
    }
}
