<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MonitorController extends Controller
{
    public function index(): Response
    {
        $monitors = Monitor::with('user')
            ->latest()
            ->get()
            ->map(fn ($monitor) => [
                'id' => $monitor->getKey(),
                'name' => $monitor->name,
                'url' => $monitor->url,
                'type' => $monitor->type,
                'status' => $monitor->status,
                'interval' => $monitor->interval,
                'check_ssl' => $monitor->check_ssl,
                'ssl_expires_at' => $monitor->ssl_expires_at?->format('Y-m-d'),
                'ssl_days_until_expiry' => $monitor->ssl_days_until_expiry,
                'ssl_issuer' => $monitor->ssl_issuer,
                'last_checked_at' => $monitor->last_checked_at?->diffForHumans(),
                'created_at' => $monitor->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Monitors/Index', [
            'monitors' => $monitors,
        ]);
    }

    public function show(Monitor $monitor): Response
    {
        $monitor->load(['heartbeats' => function ($query) {
            $query->latest()->limit(100);
        }, 'incidents' => function ($query) {
            $query->latest()->limit(20);
        }]);

        return Inertia::render('Monitors/Show', [
            'monitor' => [
                'id' => $monitor->getKey(),
                'name' => $monitor->name,
                'url' => $monitor->url,
                'type' => $monitor->type,
                'status' => $monitor->status,
                'interval' => $monitor->interval,
                'timeout' => $monitor->timeout,
                'method' => $monitor->method,
                'verify_ssl' => $monitor->verify_ssl,
                'check_ssl' => $monitor->check_ssl,
                'ssl_expires_at' => $monitor->ssl_expires_at?->format('Y-m-d H:i:s'),
                'ssl_days_until_expiry' => $monitor->ssl_days_until_expiry,
                'ssl_issuer' => $monitor->ssl_issuer,
                'metadata' => $monitor->metadata,
                'last_checked_at' => $monitor->last_checked_at?->format('Y-m-d H:i:s'),
                'created_at' => $monitor->created_at->format('M d, Y'),
            ],
            'heartbeats' => $monitor->heartbeats->map(fn ($h) => [
                'id' => $h->getKey(),
                'is_up' => $h->is_up,
                'status_code' => $h->status_code,
                'response_time' => $h->response_time,
                'error' => $h->error,
                'checked_at' => $h->checked_at?->format('Y-m-d H:i:s'),
            ]),
            'incidents' => $monitor->incidents->map(fn ($i) => [
                'id' => $i->getKey(),
                'started_at' => $i->started_at->format('Y-m-d H:i:s'),
                'resolved_at' => $i->resolved_at?->format('Y-m-d H:i:s'),
                'error_message' => $i->error_message,
                'duration' => $i->resolved_at ? $i->started_at->diffForHumans($i->resolved_at, true) : null,
            ]),
            'stats' => [
                'uptime_24h' => $this->calculateUptime($monitor, 24),
                'uptime_7d' => $this->calculateUptime($monitor, 168),
                'uptime_30d' => $this->calculateUptime($monitor, 720),
                'avg_response_time' => $monitor->heartbeats()->avg('response_time'),
                'total_incidents' => $monitor->incidents()->count(),
                'active_incidents' => $monitor->incidents()->whereNull('resolved_at')->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:500',
            'type' => 'required|in:http,ping,port,keyword',
            'interval' => 'required|integer|min:60|max:3600',
            'timeout' => 'nullable|integer|min:5|max:60',
            'method' => 'nullable|in:GET,POST,PUT,DELETE,PATCH',
            'verify_ssl' => 'nullable|boolean',
            'headers' => 'nullable|string',
            'keyword' => 'nullable|string|max:255',
            'port' => 'nullable|integer|min:1|max:65535',
            'check_ssl' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'group' => 'nullable|string|max:255',
        ]);

        if (isset($validated['headers']) && ! empty($validated['headers'])) {
            $validated['headers'] = json_decode($validated['headers'], true);
        }

        $monitor = Monitor::create([
            ...$validated,
            'user_id' => auth()->id(),
            'status' => 'pending',
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Monitor $monitor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:500',
            'type' => 'required|in:http,ping,port,keyword',
            'interval' => 'required|integer|min:60|max:3600',
            'timeout' => 'nullable|integer|min:5|max:60',
            'method' => 'nullable|in:GET,POST,PUT,DELETE,PATCH',
            'verify_ssl' => 'nullable|boolean',
            'headers' => 'nullable|string',
            'keyword' => 'nullable|string|max:255',
            'port' => 'nullable|integer|min:1|max:65535',
            'check_ssl' => 'nullable|boolean',
            'tags' => 'nullable|array',
            'group' => 'nullable|string|max:255',
        ]);

        if (isset($validated['headers']) && ! empty($validated['headers'])) {
            $validated['headers'] = json_decode($validated['headers'], true);
        }

        $monitor->update($validated);

        return redirect()->back();
    }

    public function destroy(Monitor $monitor)
    {
        $monitor->delete();

        return redirect()->route('monitors.index');
    }

    protected function calculateUptime(Monitor $monitor, int $hours): float
    {
        $heartbeats = $monitor->heartbeats()
            ->where('checked_at', '>=', now()->subHours($hours))
            ->get();

        if ($heartbeats->isEmpty()) {
            return 100.0;
        }

        $upCount = $heartbeats->where('is_up', true)->count();
        $totalCount = $heartbeats->count();

        return round(($upCount / $totalCount) * 100, 2);
    }
}
