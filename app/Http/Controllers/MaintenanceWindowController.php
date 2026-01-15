<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceWindow;
use App\Models\Monitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceWindowController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $monitors = Monitor::accessibleBy($user)->get();

        $windows = MaintenanceWindow::whereIn('monitor_id', $monitors->pluck('id'))
            ->with('monitor')
            ->latest()
            ->get()
            ->map(fn ($window) => [
                'id' => $window->getKey(),
                'name' => $window->name,
                'description' => $window->description,
                'monitor_name' => $window->monitor->name,
                'monitor_id' => $window->monitor->getKey(),
                'starts_at' => $window->starts_at->format('Y-m-d H:i'),
                'ends_at' => $window->ends_at->format('Y-m-d H:i'),
                'is_active' => $window->is_active,
                'is_ongoing' => $window->isActive(),
                'created_at' => $window->created_at->format('M d, Y'),
            ]);

        return Inertia::render('MaintenanceWindows/Index', [
            'windows' => $windows,
        ]);
    }

    public function create(): Response
    {
        $user = auth()->user();
        $monitors = Monitor::accessibleBy($user)->get()
            ->map(fn ($m) => [
                'value' => $m->getKey(),
                'label' => $m->name,
            ]);

        return Inertia::render('MaintenanceWindows/Create', [
            'monitors' => $monitors,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeWrite();

        $validated = $request->validate([
            'monitor_id' => 'required|exists:monitors,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'is_active' => 'boolean',
        ]);

        MaintenanceWindow::create($validated);

        return redirect()->route('maintenance-windows.index');
    }

    public function destroy(MaintenanceWindow $maintenanceWindow)
    {
        $this->authorizeWrite();

        $maintenanceWindow->delete();

        return redirect()->route('maintenance-windows.index');
    }
}
