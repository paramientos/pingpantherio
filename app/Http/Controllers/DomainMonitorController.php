<?php

namespace App\Http\Controllers;

use App\Jobs\CheckDomainExpirations;
use App\Models\DomainMonitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DomainMonitorController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $query = DomainMonitor::query();

        if ($user->role === \App\Enums\Role::ADMIN) {
        } elseif ($user->teams()->exists()) {
            $teamUserIds = $user->teams()
                ->with('users')
                ->get()
                ->pluck('users')
                ->flatten()
                ->pluck('id')

                ->unique();
            $query->whereIn('user_id', $teamUserIds);
        } else {
            $query->where('user_id', $user->id);
        }

        $domains = $query->latest()
            ->get()
            ->map(fn ($domain) => [
                'id' => $domain->getKey(),
                'domain' => $domain->domain,
                'expires_at' => $domain->expires_at?->format('M d, Y'),
                'days_left' => $domain->daysUntilExpiry(),
                'is_active' => $domain->is_active,
                'last_checked' => $domain->last_checked_at?->diffForHumans(),
            ]);

        $isReadOnly = $user->role === 'user' || $user->role === 'member';

        return Inertia::render('Domains/Index', [
            'domains' => $domains,
            'isReadOnly' => $isReadOnly,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeWrite();

        $validated = $request->validate([
            'domain' => 'required|string|max:255',
        ]);

        $domainMonitor = DomainMonitor::create([
            'user_id' => auth()->id(),
            'domain' => str_replace(['http://', 'https://'], '', $validated['domain']),
            'is_active' => true,
        ]);

        dispatch(new CheckDomainExpirations($domainMonitor));

        return redirect()->route('domains.index')
            ->with('message', 'Domain added for monitoring');
    }

    public function destroy(DomainMonitor $domain)
    {
        $this->authorizeWrite();

        $domain->delete();

        return redirect()->route('domains.index');
    }
}
