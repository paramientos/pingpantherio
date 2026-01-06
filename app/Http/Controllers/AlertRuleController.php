<?php

namespace App\Http\Controllers;

use App\Models\AlertChannel;
use App\Models\AlertRule;
use App\Models\Monitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlertRuleController extends Controller
{
    public function index(): Response
    {
        $rules = AlertRule::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('AlertRules/Index', [
            'rules' => $rules,
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

        $channels = AlertChannel::where('user_id', auth()->id())
            ->get()
            ->map(fn ($c) => [
                'value' => $c->getKey(),
                'label' => $c->name . ' (' . $c->type . ')',
            ]);

        return Inertia::render('AlertRules/Create', [
            'monitors' => $monitors,
            'channels' => $channels,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'condition_type' => 'required|in:response_time,status_code,ssl_expiry',
            'condition_value' => 'required',
            'threshold' => 'nullable|integer',
            'duration' => 'nullable|integer',
            'monitor_ids' => 'required|array|min:1',
            'channel_ids' => 'required|array|min:1',
            'is_active' => 'boolean',
        ]);

        AlertRule::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('alert-rules.index')
            ->with('message', 'Alert rule created successfully');
    }

    public function destroy(AlertRule $alertRule)
    {
        $alertRule->delete();
        return redirect()->route('alert-rules.index');
    }
}
