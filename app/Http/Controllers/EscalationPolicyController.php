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
        $user = auth()->user();
        $policyQuery = EscalationPolicy::query();
        $channelQuery = AlertChannel::query();
        
        // Admin sees all escalation policies and channels
        if (!$user->role->isAdmin()) {
            $policyQuery->where('user_id', $user->id);
            $channelQuery->where('user_id', $user->id);
        }
        
        $policies = $policyQuery->with(['rules.channel', 'monitors'])
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
                    'channel_name' => $rule->channel?->name ?? $rule->onCallSchedule?->name . ' (On-Call)',
                    'channel_type' => $rule->channel?->type ?? 'on_call',
                ]),
            ]);

        $channels = $channelQuery->get()->map(fn ($c) => [
            'value' => $c->id,
            'label' => $c->name . ' (' . ucfirst($c->type) . ')',
        ]);

        return Inertia::render('EscalationPolicies/Index', [
            'policies' => $policies,
            'channels' => $channels,
            'schedules' => \App\Models\OnCallSchedule::where('user_id', auth()->id())->get()->map(fn ($s) => [
                'value' => $s->id,
                'label' => $s->name . ' (On-Call Rotation)',
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeWrite();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'rules' => 'required|array|min:1',
            'rules.*.alert_channel_id' => 'nullable|required_without:rules.*.on_call_schedule_id|exists:alert_channels,id',
            'rules.*.on_call_schedule_id' => 'nullable|required_without:rules.*.alert_channel_id|exists:on_call_schedules,id',
            'rules.*.delay_minutes' => 'required|integer|min:0',
        ]);

        $policy = EscalationPolicy::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        foreach ($validated['rules'] as $index => $rule) {
            $policy->rules()->create([
                'alert_channel_id' => $rule['alert_channel_id'] ?? null,
                'on_call_schedule_id' => $rule['on_call_schedule_id'] ?? null,
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

        $schedules = \App\Models\OnCallSchedule::where('user_id', auth()->user()->id)->get()->map(fn ($s) => [
            'value' => $s->id,
            'label' => $s->name . ' (On-Call Rotation)',
        ]);

        return Inertia::render('EscalationPolicies/Edit', [
            'policy' => [
                'id' => $escalationPolicy->id,
                'name' => $escalationPolicy->name,
                'description' => $escalationPolicy->description,
                'rules' => $escalationPolicy->rules->map(fn ($rule) => [
                    'id' => $rule->id,
                    'alert_channel_id' => $rule->alert_channel_id,
                    'on_call_schedule_id' => $rule->on_call_schedule_id,
                    'delay_minutes' => $rule->delay_minutes,
                    'position' => $rule->position,
                ]),
            ],
            'channels' => $channels,
            'schedules' => $schedules,
        ]);
    }

    public function update(Request $request, EscalationPolicy $escalationPolicy)
    {
        $this->authorizeWrite();

        if ($escalationPolicy->user_id !== auth()->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'rules' => 'required|array|min:1',
            'rules.*.alert_channel_id' => 'nullable|required_without:rules.*.on_call_schedule_id|exists:alert_channels,id',
            'rules.*.on_call_schedule_id' => 'nullable|required_without:rules.*.alert_channel_id|exists:on_call_schedules,id',
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
                'alert_channel_id' => $rule['alert_channel_id'] ?? null,
                'on_call_schedule_id' => $rule['on_call_schedule_id'] ?? null,
                'delay_minutes' => $rule['delay_minutes'],
                'position' => $index,
            ]);
        }

        return redirect()->route('escalation-policies.index')->with('success', 'Policy updated.');
    }

    public function destroy(EscalationPolicy $escalationPolicy)
    {
        $this->authorizeWrite();

        if ($escalationPolicy->user_id !== auth()->user()->id) {
            abort(403);
        }

        $escalationPolicy->delete();

        return back()->with('success', 'Policy deleted.');
    }
}
