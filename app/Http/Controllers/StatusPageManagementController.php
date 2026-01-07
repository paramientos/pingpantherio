<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use App\Models\StatusPage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StatusPageManagementController extends Controller
{
    public function index(): Response
    {
        $statusPages = StatusPage::where('user_id', auth()->id())
            ->withCount('monitors')
            ->latest()
            ->get()
            ->map(fn ($page) => [
                'id' => $page->getKey(),
                'name' => $page->name,
                'slug' => $page->slug,
                'is_public' => $page->is_public,
                'monitors_count' => $page->monitors_count,
                'url' => route('status-page.show', $page->slug),
                'created_at' => $page->created_at->format('M d, Y'),
            ]);

        return Inertia::render('StatusPages/Index', [
            'statusPages' => $statusPages,
        ]);
    }

    public function create(): Response
    {
        $monitors = Monitor::where('user_id', auth()->id())
            ->get()
            ->map(fn ($m) => [
                'value' => $m->getKey(),
                'label' => $m->name,
            ]);

        return Inertia::render('StatusPages/Create', [
            'monitors' => $monitors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:status_pages,slug',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|string|max:255',
            'favicon_url' => 'nullable|string|max:255',
            'custom_domain' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'show_uptime' => 'boolean',
            'show_incidents' => 'boolean',
            'hide_branding' => 'boolean',
            'monitor_ids' => 'nullable|array',
            'monitor_ids.*' => 'exists:monitors,id',
        ]);

        $statusPage = StatusPage::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        if (! empty($validated['monitor_ids'])) {
            foreach ($validated['monitor_ids'] as $index => $monitorId) {
                $statusPage->monitors()->attach($monitorId, ['display_order' => $index]);
            }
        }

        return redirect()->route('status-pages.index');
    }

    public function edit(StatusPage $statusPage): Response
    {
        $monitors = Monitor::where('user_id', auth()->id())
            ->get()
            ->map(fn ($m) => [
                'value' => $m->getKey(),
                'label' => $m->name,
            ]);

        $selectedMonitors = $statusPage->monitors->pluck('id')->toArray();

        return Inertia::render('StatusPages/Edit', [
            'statusPage' => [
                'id' => $statusPage->getKey(),
                'name' => $statusPage->name,
                'slug' => $statusPage->slug,
                'description' => $statusPage->description,
                'logo_url' => $statusPage->logo_url,
                'favicon_url' => $statusPage->favicon_url,
                'custom_domain' => $statusPage->custom_domain,
                'is_public' => $statusPage->is_public,
                'show_uptime' => $statusPage->show_uptime,
                'show_incidents' => $statusPage->show_incidents,
                'hide_branding' => $statusPage->hide_branding,
                'monitor_ids' => $selectedMonitors,
            ],
            'monitors' => $monitors,
        ]);
    }

    public function update(Request $request, StatusPage $statusPage)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:status_pages,slug,'.$statusPage->id,
            'description' => 'nullable|string',
            'logo_url' => 'nullable|string|max:255',
            'favicon_url' => 'nullable|string|max:255',
            'custom_domain' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'show_uptime' => 'boolean',
            'show_incidents' => 'boolean',
            'hide_branding' => 'boolean',
            'monitor_ids' => 'nullable|array',
            'monitor_ids.*' => 'exists:monitors,id',
        ]);

        $statusPage->update($validated);

        $statusPage->monitors()->detach();
        if (! empty($validated['monitor_ids'])) {
            foreach ($validated['monitor_ids'] as $index => $monitorId) {
                $statusPage->monitors()->attach($monitorId, ['display_order' => $index]);
            }
        }

        return redirect()->route('status-pages.index');
    }

    public function destroy(StatusPage $statusPage)
    {
        $statusPage->delete();

        return redirect()->route('status-pages.index');
    }
}
