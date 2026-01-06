<?php

namespace App\Http\Controllers;

use App\Models\Dashboard;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomDashboardController extends Controller
{
    public function index(): Response
    {
        $dashboards = Dashboard::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('CustomDashboards/Index', [
            'dashboards' => $dashboards,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('CustomDashboards/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'widgets' => 'required|array',
            'is_public' => 'boolean',
        ]);

        Dashboard::create([
            ...$validated,
            'user_id' => auth()->id(),
            'layout' => [],
        ]);

        return redirect()->route('custom-dashboards.index')
            ->with('message', 'Custom dashboard created successfully');
    }

    public function show(Dashboard $dashboard): Response
    {
        return Inertia::render('CustomDashboards/Show', [
            'dashboard' => $dashboard,
        ]);
    }

    public function destroy(Dashboard $dashboard)
    {
        $dashboard->delete();
        return redirect()->route('custom-dashboards.index');
    }
}
