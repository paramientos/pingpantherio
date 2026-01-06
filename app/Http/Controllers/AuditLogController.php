<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        $logs = AuditLog::with('user')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(20)
            ->through(fn ($log) => [
                'id' => $log->getKey(),
                'user_name' => $log->user?->name ?? 'System',
                'event' => $log->event,
                'target' => class_basename($log->auditable_type),
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at->diffForHumans(),
                'details' => [
                    'old' => $log->old_values,
                    'new' => $log->new_values,
                ]
            ]);

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs,
        ]);
    }
}
