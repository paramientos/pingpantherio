<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use App\Models\Playbook;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use \Symfony\Component\HttpFoundation\Response as HttpResponse;

class PlaybookController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        
        $playbookQuery = Playbook::query();

        if (!$user->role->isAdmin()) {
            $playbookQuery->where('user_id', $user->id);
        }
        
        $playbooks = $playbookQuery->withCount('monitors')
            ->latest()
            ->get();

        $monitors = Monitor::accessibleBy($user)->get()->map(fn ($m) => [
            'value' => $m->id,
            'label' => $m->name,
        ]);

        return Inertia::render('Playbooks/Index', [
            'playbooks' => $playbooks,
            'monitors' => $monitors,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeWrite();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'monitor_ids' => 'nullable|array',
            'monitor_ids.*' => 'exists:monitors,id',
        ]);

        $playbook = Playbook::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'content' => $validated['content'],
        ]);

        if (!empty($validated['monitor_ids'])) {
            Monitor::whereIn('id', $validated['monitor_ids'])
                ->where('user_id', auth()->id())
                ->update(['playbook_id' => $playbook->id]);
        }

        return back()->with('success', 'Playbook created.');
    }

    public function update(Request $request, Playbook $playbook)
    {
        $this->authorizeWrite();

        if ($playbook->user_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to edit this playbook.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'monitor_ids' => 'nullable|array',
            'monitor_ids.*' => 'exists:monitors,id',
        ]);

        $playbook->update([
            'name' => $validated['name'],
            'content' => $validated['content'],
        ]);

        // Reset old monitors
        Monitor::where('playbook_id', $playbook->id)->update(['playbook_id' => null]);

        if (!empty($validated['monitor_ids'])) {
            Monitor::whereIn('id', $validated['monitor_ids'])
                ->where('user_id', auth()->id())
                ->update(['playbook_id' => $playbook->id]);
        }

        return back()->with('success', 'Playbook updated.');
    }

    public function destroy(Playbook $playbook)
    {
        $this->authorizeWrite();

        if ($playbook->user_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to delete this playbook.');
        }

        $playbook->delete();

        return back()->with('success', 'Playbook deleted.');
    }
}
