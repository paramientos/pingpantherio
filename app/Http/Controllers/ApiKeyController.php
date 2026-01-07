<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApiKeyController extends Controller
{
    public function index(): Response
    {
        $keys = ApiKey::where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn ($key) => [
                'id' => $key->getKey(),
                'name' => $key->name,
                'key_preview' => substr($key->key, 0, 10) . '...',
                'is_active' => $key->is_active,
                'last_used_at' => $key->last_used_at?->diffForHumans(),
                'expires_at' => $key->expires_at?->format('M d, Y'),
                'created_at' => $key->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Settings/ApiKeys/Index', [
            'apiKeys' => $keys,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'expires_at' => 'nullable|date|after:today',
        ]);

        $key = ApiKey::generate();

        $apiKey = ApiKey::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'key' => $key,
            'expires_at' => $validated['expires_at'] ?? null,
            'is_active' => true,
        ]);

        return back()->with('newKey', $key);
    }

    public function destroy(ApiKey $apiKey)
    {
        $apiKey->delete();

        return back();
    }
}
