<?php

namespace App\Http\Controllers;

use App\Models\AlertChannel;
use App\Models\Monitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlertChannelController extends Controller
{
    public function index(): Response
    {
        $channels = AlertChannel::where('user_id', auth()->id())
            ->withCount('monitors')
            ->latest()
            ->get()
            ->map(fn ($channel) => [
                'id' => $channel->getKey(),
                'name' => $channel->name,
                'type' => $channel->type,
                'is_active' => $channel->is_active,
                'monitors_count' => $channel->monitors_count,
                'created_at' => $channel->created_at->format('M d, Y'),
            ]);

        return Inertia::render('AlertChannels/Index', [
            'channels' => $channels,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('AlertChannels/Create');
    }

    public function store(Request $request)
    {
        $this->authorizeWrite();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:email,slack,discord,telegram,webhook',
            'config' => 'required|array',
            'is_active' => 'boolean',
        ]);

        AlertChannel::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('alert-channels.index');
    }

    public function edit(AlertChannel $alertChannel): Response
    {
        return Inertia::render('AlertChannels/Edit', [
            'channel' => [
                'id' => $alertChannel->getKey(),
                'name' => $alertChannel->name,
                'type' => $alertChannel->type,
                'config' => $alertChannel->config,
                'is_active' => $alertChannel->is_active,
            ],
        ]);
    }

    public function update(Request $request, AlertChannel $alertChannel)
    {
        $this->authorizeWrite();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:email,slack,discord,telegram,webhook',
            'config' => 'required|array',
            'is_active' => 'boolean',
        ]);

        $alertChannel->update($validated);

        return redirect()->route('alert-channels.index');
    }

    public function destroy(AlertChannel $alertChannel)
    {
        $this->authorizeWrite();

        $alertChannel->delete();

        return redirect()->route('alert-channels.index');
    }
}
