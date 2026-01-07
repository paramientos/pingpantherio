<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $monitor_id
 * @property string $name
 * @property numeric $uptime_target
 * @property int|null $max_downtime_minutes_monthly
 * @property numeric|null $response_time_target
 * @property string $period
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Monitor $monitor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig whereMaxDowntimeMinutesMonthly($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig whereMonitorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig wherePeriod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig whereResponseTimeTarget($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SlaConfig whereUptimeTarget($value)
 * @mixin \Eloquent
 */
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
