<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\IncidentUpdate;
use Illuminate\Http\Request;

class IncidentUpdateController extends Controller
{
    public function store(Request $request, Incident $incident)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'type' => 'required|string|in:update,investigating,identified,monitoring,resolved',
            'is_public' => 'required|boolean',
        ]);

        $incident->updates()->create($validated);

        return redirect()->back();
    }
}
