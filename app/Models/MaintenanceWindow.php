<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $monitor_id
 * @property string $name
 * @property string|null $description
 * @property \Illuminate\Support\Carbon $starts_at
 * @property \Illuminate\Support\Carbon $ends_at
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Monitor $monitor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow whereEndsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow whereMonitorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow whereStartsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MaintenanceWindow whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class MaintenanceWindow extends Model
{
    use HasUuids;

    protected $fillable = [
        'monitor_id',
        'name',
        'description',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function monitor(): BelongsTo
    {
        return $this->belongsTo(Monitor::class);
    }

    public function isActive(): bool
    {
        return $this->is_active
            && now()->between($this->starts_at, $this->ends_at);
    }
}
