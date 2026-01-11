<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\Monitor;
use App\Models\Team;
use App\Models\User;
use App\Notifications\TeamInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class TeamController extends Controller
{
    public function index(): Response
    {
        $teams = Team::where('owner_id', auth()->id())
            ->orWhereHas('users', fn ($q) => $q->where('user_id', auth()->id()))
            ->with(['users', 'invitations', 'owner'])
            ->get()
            ->map(function ($team) {
                $userRole = $team->users->where('id', auth()->id())->first()?->pivot?->role;
                $isAdmin = $team->owner_id === auth()->id() || $userRole === 'admin';

                return [
                    'id' => $team->getKey(),
                    'name' => $team->name,
                    'owner' => $team->owner->name,
                    'is_admin' => $isAdmin,
                    'members' => $team->users->map(function ($user) use ($team) {
                        $monitorIds = DB::table('monitor_team_user')
                            ->where('team_id', $team->id)
                            ->where('user_id', $user->id)
                            ->pluck('monitor_id')
                            ->toArray();

                        return [
                            'id' => $user->getKey(),
                            'name' => $user->name,
                            'email' => $user->email,
                            'role' => $user->pivot->role,
                            'monitor_ids' => $monitorIds,
                        ];
                    }),
                    'invitations' => $team->invitations->map(fn ($inv) => [
                        'id' => $inv->id,
                        'email' => $inv->email,
                        'role' => $inv->role,
                        'expires_at' => $inv->expires_at->diffForHumans(),
                    ]),
                ];
            });

        $monitors = Monitor::where('user_id', auth()->id())
            ->select('id', 'name', 'type', 'status')
            ->orderBy('name')
            ->get();

        return Inertia::render('Settings/Teams/Index', [
            'teams' => $teams,
            'monitors' => $monitors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $team = Team::create([
            'owner_id' => auth()->id(),
            'name' => $validated['name'],
        ]);

        $team->users()->attach(auth()->id(), ['role' => 'admin', 'id' => Str::uuid()]);

        return back()->with('message', 'Team created successfully');
    }

    public function destroy(Team $team)
    {
        if ($team->owner_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'Only the team owner can delete this team.');
        }

        DB::transaction(function () use ($team) {
            DB::table('monitor_team_user')->where('team_id', $team->id)->delete();

            $team->invitations()->delete();

            $team->users()->detach();

            $team->delete();
        });

        return back()->with('message', 'Team deleted successfully');
    }

    public function invite(Request $request, Team $team)
    {
        $userRole = $team->users()->where('user_id', auth()->id())->first()?->pivot?->role;

        if ($team->owner_id !== auth()->id() && $userRole !== 'admin') {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to invite members to this team.');
        }

        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:8',
            'role' => 'required|in:admin,member',
        ]);

        if ($team->users()->where('email', $validated['email'])->exists()) {
            return back()->withErrors(['email' => 'This user is already a member of the team.']);
        }

        if ($team->invitations()->where('email', $validated['email'])->where('expires_at', '>', now())->exists()) {
            return back()->withErrors(['email' => 'An invitation has already been sent to this email address and is still pending.']);
        }

        // Find or create user
        $user = User::where('email', $validated['email'])->first();
        if (!$user) {
            $request->validate([
                'name' => 'required|string|max:255',
                'password' => 'required|string|min:8',
            ]);

            User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'must_change_password' => true,
            ]);
        }

        $invitation = Invitation::create([
            'team_id' => $team->getKey(),
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token' => Str::random(32),
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $validated['email'])->notify(new TeamInvitationNotification($invitation));

        return back()->with('message', 'Invitation sent successfully. User created if they did not exist.');
    }

    public function acceptInvite(string $token)
    {
        $invitation = Invitation::with('team')->where('token', $token)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        $team = $invitation->team;

        if ($team->users()->where('user_id', auth()->id())->exists()) {
            $invitation->delete();

            return redirect()->route('teams.index')->with('message', 'You are already a member of this team.');
        }

        $team->users()->attach(auth()->id(), [
            'role' => $invitation->role,
            'id' => Str::uuid(),
        ]);

        $invitation->delete();

        return redirect()->route('teams.index')->with('message', 'Welcome to the team!');
    }

    public function removeMember(Team $team, string $userId)
    {
        $userRole = $team->users()->where('user_id', auth()->id())->first()?->pivot?->role;

        if ($team->owner_id !== auth()->id() && $userRole !== 'admin') {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to remove members from this team.');
        }

        if ($team->owner_id === $userId) {
            return back()->with('error', 'You cannot remove the owner.');
        }

        DB::table('monitor_team_user')
            ->where('team_id', $team->id)
            ->where('user_id', $userId)
            ->delete();

        $team->users()->detach($userId);

        return back()->with('message', 'Member removed successfully');
    }

    public function updateMemberMonitors(Request $request, Team $team, string $userId)
    {
        $userRole = $team->users()->where('user_id', auth()->id())->first()?->pivot?->role;

        if ($team->owner_id !== auth()->id() && $userRole !== 'admin') {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to manage member permissions.');
        }

        $validated = $request->validate([
            'monitor_ids' => 'required|array',
            'monitor_ids.*' => 'exists:monitors,id',
        ]);

        DB::table('monitor_team_user')
            ->where('team_id', $team->id)
            ->where('user_id', $userId)
            ->delete();

        foreach ($validated['monitor_ids'] as $monitorId) {
            DB::table('monitor_team_user')->insert([
                'id' => Str::uuid(),
                'monitor_id' => $monitorId,
                'team_id' => $team->id,
                'user_id' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return back()->with('message', 'Monitor permissions updated successfully');
    }

    public function updateMemberRole(Request $request, Team $team, string $userId)
    {
        if ($team->owner_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'Only the team owner can change member roles.');
        }

        if ($team->owner_id === $userId) {
            return back()->with('error', 'You cannot change the owner role.');
        }

        $validated = $request->validate([
            'role' => 'required|in:admin,member',
        ]);

        $team->users()->updateExistingPivot($userId, ['role' => $validated['role']]);

        return back()->with('message', 'Member role updated successfully');
    }
}
