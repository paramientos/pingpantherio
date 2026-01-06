<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Invitation;
use App\Notifications\TeamInvitationNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;

class TeamController extends Controller
{
    public function index(): Response
    {
        // Kullanıcının sahip olduğu veya üyesi olduğu tüm ekipler
        $teams = Team::where('owner_id', auth()->id())
            ->orWhereHas('users', fn($q) => $q->where('user_id', auth()->id()))
            ->with(['users', 'invitations', 'owner'])
            ->get()
            ->map(fn ($team) => [
                'id' => $team->getKey(),
                'name' => $team->name,
                'owner' => $team->owner->name,
                'is_owner' => $team->owner_id === auth()->id(),
                'members' => $team->users->map(fn ($user) => [
                    'id' => $user->getKey(),
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->pivot->role,
                ]),
                'invitations' => $team->invitations->map(fn($inv) => [
                    'id' => $inv->id,
                    'email' => $inv->email,
                    'role' => $inv->role,
                    'expires_at' => $inv->expires_at->diffForHumans(),
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

        $team = Team::create([
            'owner_id' => auth()->id(),
            'name' => $validated['name'],
        ]);

        // Sahibi üyeler tablosuna da ekleyelim (Opsiyonel ama RBAC için iyi olur)
        $team->users()->attach(auth()->id(), ['role' => 'owner', 'id' => Str::uuid()]);

        return back()->with('message', 'Team created successfully');
    }

    public function invite(Request $request, Team $team)
    {
        // Sadece admin veya owner davet edebilir
        $userRole = $team->users()->where('user_id', auth()->id())->first()?->pivot?->role;
        if ($team->owner_id !== auth()->id() && $userRole !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,member,viewer',
        ]);

        $invitation = Invitation::create([
            'team_id' => $team->getKey(),
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token' => Str::random(32),
            'expires_at' => now()->addDays(7),
        ]);

        // E-posta gönder
        Notification::route('mail', $validated['email'])
            ->notify(new TeamInvitationNotification($invitation));

        return back()->with('message', 'Invitation sent successfully');
    }

    public function acceptInvite(string $token)
    {
        $invitation = Invitation::with('team')->where('token', $token)
            ->where('expires_at', '>', now())
            ->firstOrFail();

        $team = $invitation->team;

        // Kullanıcı zaten üyeyse
        if ($team->users()->where('user_id', auth()->id())->exists()) {
            $invitation->delete();
            return redirect()->route('teams.index')->with('message', 'You are already a member of this team.');
        }

        $team->users()->attach(auth()->id(), [
            'role' => $invitation->role,
            'id' => Str::uuid()
        ]);

        $invitation->delete();

        return redirect()->route('teams.index')->with('message', 'Welcome to the team!');
    }

    public function removeMember(Team $team, string $userId)
    {
        if ($team->owner_id !== auth()->id() && $team->users()->where('user_id', auth()->id())->wherePivot('role', 'admin')->doesntExist()) {
            abort(403);
        }

        if ($team->owner_id === $userId) {
            return back()->with('error', 'You cannot remove the owner.');
        }

        $team->users()->detach($userId);

        return back()->with('message', 'Member removed successfully');
    }
}
