<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $incident_id
 * @property string $created_by
 * @property string $title
 * @property string|null $summary
 * @property string|null $root_cause
 * @property string|null $impact_analysis
 * @property string|null $resolution_steps
 * @property string|null $preventive_measures
 * @property array<array-key, mixed>|null $timeline
 * @property array<array-key, mixed>|null $affected_services
 * @property int|null $affected_users_count
 * @property string|null $severity
 * @property \Illuminate\Support\Carbon|null $published_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $creator
 * @property-read \App\Models\Incident $incident
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereAffectedServices($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereAffectedUsersCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereImpactAnalysis($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereIncidentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem wherePreventiveMeasures($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem wherePublishedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereResolutionSteps($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereRootCause($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereSeverity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereSummary($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereTimeline($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PostMortem whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PostMortem extends Model
{
    use HasUuids;

    protected $fillable = [
        'incident_id',
        'created_by',
        'title',
        'summary',
        'root_cause',
        'impact_analysis',
        'resolution_steps',
        'preventive_measures',
        'timeline',
        'affected_services',
        'affected_users_count',
        'severity',
        'published_at',
    ];

    protected $casts = [
        'timeline' => 'array',
        'affected_services' => 'array',
        'published_at' => 'datetime',
    ];

    public function incident(): BelongsTo
    {
        return $this->belongsTo(Incident::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
