<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class TeamController extends Controller
{
    public function index(): Response
    {
        $teams = Team::where('owner_id', auth()->id())
            ->with(['users', 'invitations'])
            ->get()
            ->map(fn ($team) => [
                'id' => $team->getKey(),
                'name' => $team->name,
                'members_count' => $team->users->count(),
                'pending_invitations' => $team->invitations->count(),
                'members' => $team->users->map(fn ($user) => [
                    'id' => $user->getKey(),
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->pivot->role,
                ]),
            ]);

        return Inertia::render('Teams/Index', [
            'teams' => $teams,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Team::create([
            'owner_id' => auth()->id(),
            'name' => $validated['name'],
        ]);

        return back()->with('message', 'Team created successfully');
    }

    public function invite(Request $request, Team $team)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,member,viewer',
        ]);

        Invitation::create([
            'team_id' => $team->id,
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token' => Str::random(32),
            'expires_at' => now()->addDays(7),
        ]);

        return back()->with('message', 'Invitation sent to ' . $validated['email']);
    }
}
