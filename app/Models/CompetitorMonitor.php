<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string $url
 * @property string|null $company_name
 * @property string|null $description
 * @property string $status
 * @property int $interval
 * @property \Illuminate\Support\Carbon|null $last_checked_at
 * @property bool|null $is_up
 * @property int|null $response_time
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereCompanyName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereIsUp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereLastCheckedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereResponseTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CompetitorMonitor whereUserId($value)
 * @mixin \Eloquent
 */
class CompetitorMonitor extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'url',
        'company_name',
        'description',
        'status',
        'interval',
        'last_checked_at',
        'is_up',
        'response_time',
    ];

    protected $casts = [
        'last_checked_at' => 'datetime',
        'is_up' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
