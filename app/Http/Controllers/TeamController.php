<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\Monitor;
use App\Models\Team;
use App\Models\User;
use App\Notifications\TeamInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            ->with(['users', 'invitations', 'owner', 'monitors'])
            ->get()
            ->map(function ($team) {
                $userRole = $team->users->where('id', auth()->id())->first()?->pivot?->role;
                $isAdmin = $team->owner_id === auth()->id() || $userRole === 'admin';

                return [
                    'id' => $team->getKey(),
                    'name' => $team->name,
                    'owner' => $team->owner->name,
                    'is_admin' => $isAdmin,
                    'owner_id' => $team->owner_id,
                    'members' => $team->users->map(fn ($user) => [
                        'id' => $user->getKey(),
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->pivot->role,
                    ]),
                    'monitor_ids' => $team->monitors->pluck('id')->toArray(),
                    'monitors_count' => $team->monitors->count(),
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

        $allUsers = User::orderBy('name')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Settings/Teams/Index', [
            'teams' => $teams,
            'monitors' => $monitors,
            'allUsers' => $allUsers,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeWrite();
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
        $this->authorizeWrite();
        if ($team->owner_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'Only the team owner can delete this team.');
        }

        DB::transaction(function () use ($team) {

            $team->invitations()->delete();

            $team->users()->detach();

            $team->delete();
        });

        return back()->with('message', 'Team deleted successfully');
    }

    public function invite(Request $request, Team $team)
    {
        $this->authorizeWrite();
        $userRole = $team->users()->where('user_id', auth()->id())->first()?->pivot?->role;

        if ($team->owner_id !== auth()->id() && $userRole !== 'admin') {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to invite members to this team.');
        }

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'role' => 'required|in:admin,member',
        ]);

        if ($team->users()->where('email', $validated['email'])->exists()) {
            return back()->withErrors(['email' => 'This user is already a member of the team.']);
        }

        if ($team->invitations()->where('email', $validated['email'])->where('expires_at', '>', now())->exists()) {
            return back()->withErrors(['email' => 'An invitation has already been sent to this user and is still pending.']);
        }

        $invitation = Invitation::create([
            'team_id' => $team->getKey(),
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token' => Str::random(32),
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $validated['email'])->notify(new TeamInvitationNotification($invitation));

        return back()->with('message', 'Invitation sent successfully.');
    }

    public function acceptInvite(string $token)
    {
        $invitation = Invitation::with('team')->where('token', $token)
            ->where('email', auth()->user()->email)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        $team = $invitation->team;

        if ($team->users()->where('user_id', auth()->id())->exists()) {
            $invitation->delete();

            return redirect()->route('dashboard')->with('message', 'You are already a member of this team.');
        }

        $team->users()->attach(auth()->id(), [
            'role' => $invitation->role,
            'id' => Str::uuid(),
        ]);

        $invitation->delete();

        return redirect()->route('dashboard')->with('message', 'Welcome to the team!');
    }

    public function rejectInvite(string $token)
    {
        $invitation = Invitation::where('token', $token)
            ->where('email', auth()->user()->email)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        $invitation->delete();

        return redirect()->route('dashboard')->with('message', 'Invitation rejected.');
    }

    public function removeMember(Team $team, string $userId)
    {
        $this->authorizeWrite();
        $userRole = $team->users()->where('user_id', auth()->id())->first()?->pivot?->role;

        if ($team->owner_id !== auth()->id() && $userRole !== 'admin') {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to remove members from this team.');
        }

        if ($team->owner_id === $userId) {
            return back()->with('error', 'You cannot remove the owner.');
        }

        $team->users()->detach($userId);

        return back()->with('message', 'Member removed successfully');
    }

    public function updateTeamMonitors(Request $request, Team $team)
    {
        $this->authorizeWrite();
        $userRole = $team->users()->where('user_id', auth()->id())->first()?->pivot?->role;

        if ($team->owner_id !== auth()->id() && $userRole !== 'admin') {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to manage team monitors.');
        }

        $validated = $request->validate([
            'monitor_ids' => 'required|array',
            'monitor_ids.*' => 'exists:monitors,id',
        ]);

        // Prepare sync data with UUIDs for pivot table
        $syncData = [];
        foreach ($validated['monitor_ids'] as $monitorId) {
            $syncData[$monitorId] = ['id' => \Illuminate\Support\Str::uuid()->toString()];
        }

        $team->monitors()->sync($syncData);

        return back()->with('message', 'Team monitors updated successfully');
    }

    public function updateMemberRole(Request $request, Team $team, string $userId)
    {
        $this->authorizeWrite();
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

    public function resendInvitation(Team $team, $invitationId)
    {
        $this->authorizeWrite();
        $userRole = $team->users()->where('user_id', auth()->id())->first()?->pivot?->role;

        if ($team->owner_id !== auth()->id() && $userRole !== 'admin') {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to manage invitations for this team.');
        }

        $invitation = $team->invitations()->findOrFail($invitationId);

        $invitation->update([
            'token' => Str::random(32),
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $invitation->email)->notify(new TeamInvitationNotification($invitation));

        return back()->with('message', 'Invitation resent successfully.');
    }
}
