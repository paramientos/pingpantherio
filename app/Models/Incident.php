<?php

namespace App\Models;

use App\Enums\IncidentStatus;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $monitor_id
 * @property string|null $title
 * @property string|null $description
 * @property IncidentStatus $status
 * @property \Illuminate\Support\Carbon $started_at
 * @property \Illuminate\Support\Carbon|null $resolved_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $error_message
 * @property-read \App\Models\Monitor $monitor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereErrorMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereMonitorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereResolvedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Incident whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Incident extends Model
{
    use HasUuids;

    protected $fillable = [
        'monitor_id',
        'title',
        'description',
        'status',
        'started_at',
        'resolved_at',
        'error_message',
        'screenshot_path',
        'html_snapshot',
        'response_headers',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'resolved_at' => 'datetime',
        'status' => IncidentStatus::class,
        'response_headers' => 'array',
    ];

    public function monitor(): BelongsTo
    {
        return $this->belongsTo(Monitor::class);
    }

    public function updates()
    {
        return $this->hasMany(IncidentUpdate::class)->latest();
    }
}
