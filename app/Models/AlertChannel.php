<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string $type
 * @property array<array-key, mixed> $config
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Monitor> $monitors
 * @property-read int|null $monitors_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel whereConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AlertChannel whereUserId($value)
 * @mixin \Eloquent
 */
class AlertChannel extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'config',
        'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function monitors(): BelongsToMany
    {
        return $this->belongsToMany(Monitor::class);
    }
}
