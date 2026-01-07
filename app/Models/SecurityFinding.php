<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $user_id
 * @property string $source_type
 * @property string|null $source_id
 * @property string $title
 * @property string $description
 * @property string $severity
 * @property string $status
 * @property array<array-key, mixed>|null $remediation_steps
 * @property \Illuminate\Support\Carbon $detected_at
 * @property \Illuminate\Support\Carbon|null $resolved_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereDetectedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereRemediationSteps($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereResolvedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereSeverity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereSourceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereSourceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SecurityFinding whereUserId($value)
 * @mixin \Eloquent
 */
class SecurityFinding extends Model
{
    use HasUuids, Auditable;

    protected $fillable = [
        'user_id',
        'source_type',
        'source_id',
        'title',
        'description',
        'severity',
        'status',
        'remediation_steps',
        'detected_at',
        'resolved_at',
    ];

    protected $casts = [
        'remediation_steps' => 'array',
        'detected_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
