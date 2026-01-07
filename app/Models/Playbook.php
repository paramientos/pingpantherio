<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string $content
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Monitor> $monitors
 * @property-read int|null $monitors_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Playbook newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Playbook newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Playbook query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Playbook whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Playbook whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Playbook whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Playbook whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Playbook whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Playbook whereUserId($value)
 * @mixin \Eloquent
 */
class Playbook extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'content',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function monitors(): HasMany
    {
        return $this->hasMany(Monitor::class);
    }
}
