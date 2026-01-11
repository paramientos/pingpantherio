<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\PostMortem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use \Symfony\Component\HttpFoundation\Response as HttpResponse;

class PostMortemController extends Controller
{
    public function index(): Response
    {
        $postMortems = PostMortem::with(['incident.monitor'])
            ->whereHas('incident.monitor', fn ($q) => $q->where('user_id', auth()->id()))
            ->latest()
            ->get();

        return Inertia::render('PostMortems/Index', [
            'postMortems' => $postMortems,
        ]);
    }

    public function create(Incident $incident): Response
    {
        if ($incident->monitor->user_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to create a post-mortem report for this incident.');
        }

        return Inertia::render('PostMortems/Create', [
            'incident' => $incident->load('monitor'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'incident_id' => 'required|exists:incidents,id',
            'title' => 'required|string|max:255',
            'summary' => 'required|string',
            'root_cause' => 'nullable|string',
            'resolution_steps' => 'nullable|string',
            'preventive_measures' => 'nullable|string',
            'severity' => 'required|string|in:low,medium,high,critical',
        ]);

        $incident = Incident::findOrFail($validated['incident_id']);
        if ($incident->monitor->user_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to create a post-mortem report for this incident.');
        }

        PostMortem::create([
            ...$validated,
            'created_by' => auth()->id(),
            'published_at' => now(),
        ]);

        return redirect()->route('post-mortems.index')->with('success', 'Post-mortem report published.');
    }

    public function show(PostMortem $postMortem): Response
    {
        if ($postMortem->incident->monitor->user_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to view this post-mortem report.');
        }

        return Inertia::render('PostMortems/Show', [
            'postMortem' => $postMortem->load(['incident.monitor', 'creator']),
        ]);
    }

    public function destroy(PostMortem $postMortem)
    {
        if ($postMortem->incident->monitor->user_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to delete this post-mortem report.');
        }

        $postMortem->delete();

        return back()->with('success', 'Post-mortem report deleted.');
    }
}
