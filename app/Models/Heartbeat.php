<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $monitor_id
 * @property bool $is_up
 * @property int|null $status_code
 * @property float|null $response_time
 * @property string $status
 * @property string|null $error
 * @property \Illuminate\Support\Carbon|null $checked_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property array<array-key, mixed>|null $metadata
 * @property float|null $dns_time
 * @property float|null $connect_time
 * @property float|null $ttfb
 * @property-read \App\Models\Monitor $monitor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereCheckedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereConnectTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereDnsTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereError($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereIsUp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereMonitorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereResponseTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereStatusCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereTtfb($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Heartbeat whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Heartbeat extends Model
{
    use HasUuids;

    protected $fillable = [
        'monitor_id',
        'is_up',
        'status_code',
        'response_time',
        'status',
        'error',
        'metadata',
        'checked_at',
    ];

    protected $casts = [
        'is_up' => 'boolean',
        'metadata' => 'array',
        'checked_at' => 'datetime',
    ];

    public function monitor(): BelongsTo
    {
        return $this->belongsTo(Monitor::class);
    }
}
