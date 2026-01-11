<?php

namespace App\Http\Controllers;

use App\Models\Webhook;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use \Symfony\Component\HttpFoundation\Response as HttpResponse;

class WebhookController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/Webhooks/Index', [
            'webhooks' => Webhook::where('user_id', auth()->id())->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'events' => 'required|array',
            'is_active' => 'boolean',
        ]);

        Webhook::create([
            ...$validated,
            'user_id' => auth()->id(),
            'secret_token' => Str::random(32),
        ]);

        return redirect()->back()->with('message', 'Webhook created successfully');
    }

    public function destroy(Webhook $webhook)
    {
        if ($webhook->user_id !== auth()->id()) {
            abort(HttpResponse::HTTP_FORBIDDEN, 'You are not allowed to delete this webhook.');
        }

        $webhook->delete();

        return redirect()->back()->with('message', 'Webhook deleted successfully');
    }
}
