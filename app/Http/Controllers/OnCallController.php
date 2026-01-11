<?php

namespace App\Http\Controllers;

use App\Models\OnCallRotation;
use App\Models\OnCallSchedule;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnCallController extends Controller
{
    public function index(): Response
    {
        $schedules = OnCallSchedule::where('user_id', auth()->id())
            ->with(['rotations.user'])
            ->latest()
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'name' => $schedule->name,
                    'timezone' => $schedule->timezone,
                    'current_on_call' => $schedule->getCurrentOnCallUser()?->name ?? 'No one',
                    'rotations' => $schedule->rotations,
                ];
            });

        $teamMembers = User::all()->map(fn($u) => [
            'value' => $u->id,
            'label' => $u->name,
        ]);

        return Inertia::render('OnCall/Index', [
            'schedules' => $schedules,
            'teamMembers' => $teamMembers,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeWrite();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'timezone' => 'required|string',
            'rotations' => 'required|array|min:1',
            'rotations.*.user_id' => 'required|exists:users,id',
            'rotations.*.duration_days' => 'required|integer|min:1',
        ]);

        $schedule = OnCallSchedule::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'timezone' => $validated['timezone'],
        ]);

        foreach ($validated['rotations'] as $index => $rotation) {
            OnCallRotation::create([
                'schedule_id' => $schedule->id,
                'user_id' => $rotation['user_id'],
                'order_index' => $index,
                'duration_days' => $rotation['duration_days'],
            ]);
        }

        return back()->with('success', 'On-call schedule created.');
    }

    public function destroy(OnCallSchedule $on_call)
    {
        $this->authorizeWrite();

        if ($on_call->user_id !== auth()->id()) {
            abort(\Symfony\Component\HttpFoundation\Response::HTTP_FORBIDDEN);
        }

        $on_call->delete();

        return back()->with('success', 'On-call schedule deleted.');
    }
}
