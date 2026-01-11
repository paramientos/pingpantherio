<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $incident_id
 * @property string $message
 * @property string $type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property bool $is_public
 * @property-read \App\Models\Incident $incident
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate whereIncidentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate whereIsPublic($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IncidentUpdate whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class IncidentUpdate extends Model
{
    use HasUuids;

    protected $fillable = [
        'incident_id',
        'message',
        'type',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }
}
