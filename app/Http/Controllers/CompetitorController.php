<?php

namespace App\Http\Controllers;

use App\Models\CompetitorMonitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompetitorController extends Controller
{
    public function index(): Response
    {
        $competitors = CompetitorMonitor::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Competitors/Index', [
            'competitors' => $competitors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'company_name' => 'nullable|string|max:255',
            'interval' => 'required|integer|min:60',
        ]);

        CompetitorMonitor::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return back()->with('success', 'Competitor monitor added.');
    }

    public function destroy(CompetitorMonitor $competitor)
    {
        if ($competitor->user_id !== auth()->id()) {
            abort(403);
        }

        $competitor->delete();

        return back()->with('success', 'Competitor monitor removed.');
    }
}
