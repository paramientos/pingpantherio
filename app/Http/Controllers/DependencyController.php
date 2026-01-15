<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use App\Models\MonitorDependency;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DependencyController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $monitors = Monitor::accessibleBy($user)
            ->with(['dependencies.dependsOnMonitor', 'dependents.monitor'])
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'status' => $m->status,
                'dependencies' => $m->dependencies->map(fn ($d) => [
                    'id' => $d->id,
                    'monitor_id' => $d->depends_on_monitor_id,
                    'name' => $d->dependsOnMonitor->name,
                    'status' => $d->dependsOnMonitor->status,
                    'type' => $d->relationship_type,
                ]),
                'dependents' => $m->dependents->map(fn ($d) => [
                    'id' => $d->id,
                    'monitor_id' => $d->monitor_id,
                    'name' => $d->monitor->name,
                    'status' => $d->monitor->status,
                    'type' => $d->relationship_type,
                ]),
            ]);

        $allMonitors = Monitor::accessibleBy($user)->get()->map(fn ($m) => [
            'value' => $m->id,
            'label' => $m->name,
        ]);

        return Inertia::render('Dependencies/Index', [
            'monitors' => $monitors,
            'allMonitors' => $allMonitors,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeWrite();

        $validated = $request->validate([
            'monitor_id' => 'required|exists:monitors,id',
            'depends_on_monitor_id' => 'required|exists:monitors,id|different:monitor_id',
            'relationship_type' => 'required|string|in:depends_on,impacts,related',
            'description' => 'nullable|string',
        ]);

        // Check ownership
        $monitor = Monitor::findOrFail($validated['monitor_id']);
        $dependsOn = Monitor::findOrFail($validated['depends_on_monitor_id']);

        if ($monitor->user_id !== auth()->id() || $dependsOn->user_id !== auth()->id()) {
            abort(403);
        }

        MonitorDependency::create($validated);

        return back()->with('success', 'Dependency added.');
    }

    public function destroy(MonitorDependency $dependency)
    {
        $this->authorizeWrite();

        if ($dependency->monitor->user_id !== auth()->id()) {
            abort(403);
        }

        $dependency->delete();

        return back()->with('success', 'Dependency removed.');
    }
}
