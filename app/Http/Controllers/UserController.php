<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Enums\Role;
use App\Notifications\WelcomeUserWithPasswordNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('Settings/Users/Index', [
            'users' => User::orderBy('name')->get()->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'must_change_password' => $user->must_change_password,
                'created_at' => $user->created_at->diffForHumans(),
            ]),
            'roles' => Role::cases(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'nullable|string|min:8',
            'role' => 'required|string',
            'must_change_password' => 'boolean',
        ]);

        $password = $validated['password'] ?? Str::random(12);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($password),
            'role' => $validated['role'],
            'must_change_password' => $validated['must_change_password'] ?? true,
        ]);

        Notification::send($user, new WelcomeUserWithPasswordNotification($password, $user->must_change_password));

        return back()->with('message', 'User created and welcome email sent successfully');
    }

    public function update(Request $request, User $user)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string',
            'must_change_password' => 'boolean',
        ]);

        $user->update($validated);

        return back()->with('message', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $this->authorizeAdmin();

        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete yourself');
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($user) {
            // Delete pending invitations for this user's email
            \App\Models\Invitation::where('email', $user->email)->delete();

            // Delete monitor permissions for this user
            \Illuminate\Support\Facades\DB::table('monitor_team_user')->where('user_id', $user->id)->delete();

            // Detach from all teams
            $user->teams()->detach();

            // Delete the user
            $user->delete();
        });

        return back()->with('message', 'User and related data deleted successfully');
    }

    private function authorizeAdmin()
    {
        if (auth()->user()->role !== Role::ADMIN) {
            abort(403, 'Unauthorized action.');
        }
    }
}
