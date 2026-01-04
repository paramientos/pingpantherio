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
                'last_checked_at' => $monitor->last_checked_at?->diffForHumans(),
                'created_at' => $monitor->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Monitors/Index', [
            'monitors' => $monitors,
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

        return redirect()->back();
    }
}
