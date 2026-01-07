<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $monitor_id
 * @property string $name
 * @property string $type
 * @property array<array-key, mixed> $config
 * @property int $delay_seconds
 * @property bool $is_active
 * @property int $max_retries
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RecoveryLog> $logs
 * @property-read int|null $logs_count
 * @property-read \App\Models\Monitor $monitor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereDelaySeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereMaxRetries($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereMonitorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RecoveryAction whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class RecoveryAction extends Model
{
    use HasUuids, Auditable;

    protected $fillable = [
        'monitor_id',
        'name',
        'type',
        'config',
        'delay_seconds',
        'is_active',
        'max_retries',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
    ];

    public function monitor(): BelongsTo
    {
        return $this->belongsTo(Monitor::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(RecoveryLog::class);
    }
}
