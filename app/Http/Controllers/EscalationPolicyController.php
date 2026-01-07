<?php

namespace App\Http\Controllers;

use App\Models\AlertChannel;
use App\Models\EscalationPolicy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EscalationPolicyController extends Controller
{
    public function index(): Response
    {
        $policies = EscalationPolicy::where('user_id', auth()->id())
            ->with(['rules.channel', 'monitors'])
            ->latest()
            ->get()
            ->map(fn ($policy) => [
                'id' => $policy->id,
                'name' => $policy->name,
                'description' => $policy->description,
                'rules_count' => $policy->rules->count(),
                'monitors_count' => $policy->monitors->count(),
                'monitors' => $policy->monitors->map(fn ($m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                ]),
                'steps' => $policy->rules->map(fn ($rule) => [
                    'id' => $rule->id,
                    'delay' => $rule->delay_minutes,
                    'channel_name' => $rule->channel->name,
                    'channel_type' => $rule->channel->type,
                ]),
            ]);

        $channels = AlertChannel::where('user_id', auth()->id())->get()->map(fn ($c) => [
            'value' => $c->id,
            'label' => $c->name . ' (' . ucfirst($c->type) . ')',
        ]);

        return Inertia::render('EscalationPolicies/Index', [
            'policies' => $policies,
            'channels' => $channels,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'rules' => 'required|array|min:1',
            'rules.*.alert_channel_id' => 'required|exists:alert_channels,id',
            'rules.*.delay_minutes' => 'required|integer|min:0',
        ]);

        $policy = EscalationPolicy::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        foreach ($validated['rules'] as $index => $rule) {
            $policy->rules()->create([
                'alert_channel_id' => $rule['alert_channel_id'],
                'delay_minutes' => $rule['delay_minutes'],
                'position' => $index,
            ]);
        }

        return back()->with('success', 'Escalation policy created.');
    }

    public function edit(EscalationPolicy $escalationPolicy): Response
    {
        if ($escalationPolicy->user_id !== auth()->user()->id) {
            abort(403);
        }

        $escalationPolicy->load(['rules.channel']);

        $channels = AlertChannel::where('user_id', auth()->user()->id)->get()->map(fn ($c) => [
            'value' => $c->id,
            'label' => $c->name . ' (' . ucfirst($c->type) . ')',
        ]);

        return Inertia::render('EscalationPolicies/Edit', [
            'policy' => [
                'id' => $escalationPolicy->id,
                'name' => $escalationPolicy->name,
                'description' => $escalationPolicy->description,
                'rules' => $escalationPolicy->rules->map(fn ($rule) => [
                    'id' => $rule->id,
                    'alert_channel_id' => $rule->alert_channel_id,
                    'delay_minutes' => $rule->delay_minutes,
                    'position' => $rule->position,
                ]),
            ],
            'channels' => $channels,
        ]);
    }

    public function update(Request $request, EscalationPolicy $escalationPolicy)
    {
        if ($escalationPolicy->user_id !== auth()->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'rules' => 'required|array|min:1',
            'rules.*.alert_channel_id' => 'required|exists:alert_channels,id',
            'rules.*.delay_minutes' => 'required|integer|min:0',
        ]);

        $escalationPolicy->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        // Delete old rules and create new ones
        $escalationPolicy->rules()->delete();

        foreach ($validated['rules'] as $index => $rule) {
            $escalationPolicy->rules()->create([
                'alert_channel_id' => $rule['alert_channel_id'],
                'delay_minutes' => $rule['delay_minutes'],
                'position' => $index,
            ]);
        }

        return redirect()->route('escalation-policies.index')->with('success', 'Policy updated.');
    }

    public function destroy(EscalationPolicy $escalationPolicy)
    {
        if ($escalationPolicy->user_id !== auth()->user()->id) {
            abort(403);
        }

        $escalationPolicy->delete();

        return back()->with('success', 'Policy deleted.');
    }
}
