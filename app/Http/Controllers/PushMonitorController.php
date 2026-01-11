<?php

namespace App\Http\Controllers;

use App\Models\Heartbeat;
use App\Models\Monitor;

class PushMonitorController extends Controller
{
    public function ping(string $uuid)
    {
        $monitor = Monitor::where('uuid', $uuid)->firstOrFail();

        if ($monitor->type !== 'push') {
            return response()->json(['error' => 'Monitor type mismatch'], 400);
        }

        $monitor->update([
            'status' => 'up',
            'last_ping_at' => now(),
            'last_checked_at' => now(),
        ]);

        Heartbeat::create([
            'monitor_id' => $monitor->id,
            'is_up' => true,
            'response_time' => 0,
            'status_code' => 200,
            'checked_at' => now(),
        ]);

        return response()->json(['status' => 'ok', 'message' => 'Heartbeat received']);
    }
}
