<?php

namespace App\Http\Controllers;

use App\Models\Monitor;
use App\Models\RecoveryAction;
use Illuminate\Http\Request;

class RecoveryActionController extends Controller
{
    public function store(Request $request, Monitor $monitor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:webhook,ssh',
            'config' => 'required|array',
            'delay_seconds' => 'nullable|integer|min:0',
        ]);

        $monitor->recoveryActions()->create($validated);

        return back()->with('message', 'Recovery action added successfully');
    }

    public function destroy(RecoveryAction $recoveryAction)
    {
        $recoveryAction->delete();
        return back()->with('message', 'Recovery action deleted');
    }
}
