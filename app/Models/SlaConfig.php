<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SlaConfig extends Model
{
    use HasUuids;

    protected $fillable = [
        'monitor_id',
        'name',
        'uptime_target',
        'max_downtime_minutes_monthly',
        'response_time_target',
        'period',
        'is_active',
    ];

    protected $casts = [
        'uptime_target' => 'decimal:2',
        'response_time_target' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function monitor(): BelongsTo
    {
        return $this->belongsTo(Monitor::class);
    }

    public function calculateCurrentUptime(): float
    {
        $days = match($this->period) {
            'daily' => 1,
            'weekly' => 7,
            'monthly' => 30,
            default => 30,
        };

        $heartbeats = $this->monitor->heartbeats()
            ->where('checked_at', '>=', now()->subDays($days))
            ->get();

        if ($heartbeats->isEmpty()) {
            return 100.0;
        }

        $upCount = $heartbeats->where('is_up', true)->count();
        $totalCount = $heartbeats->count();

        return round(($upCount / $totalCount) * 100, 2);
    }

    public function calculateCurrentDowntime(): int
    {
        $days = match($this->period) {
            'daily' => 1,
            'weekly' => 7,
            'monthly' => 30,
            default => 30,
        };

        $incidents = $this->monitor->incidents()
            ->where('started_at', '>=', now()->subDays($days))
            ->get();

        return $incidents->sum(function ($incident) {
            $end = $incident->resolved_at ?? now();
            return $incident->started_at->diffInMinutes($end);
        });
    }

    public function isCompliant(): bool
    {
        $currentUptime = $this->calculateCurrentUptime();
        
        if ($currentUptime < $this->uptime_target) {
            return false;
        }

        if ($this->max_downtime_minutes_monthly) {
            $currentDowntime = $this->calculateCurrentDowntime();
            if ($currentDowntime > $this->max_downtime_minutes_monthly) {
                return false;
            }
        }

        return true;
    }
}
