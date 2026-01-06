<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string|null $description
 * @property array<array-key, mixed> $widgets
 * @property array<array-key, mixed>|null $layout
 * @property bool $is_default
 * @property bool $is_public
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereIsPublic($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereLayout($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dashboard whereWidgets($value)
 * @mixin \Eloquent
 */
class Dashboard extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'widgets',
        'layout',
        'is_default',
        'is_public',
    ];

    protected $casts = [
        'widgets' => 'array',
        'layout' => 'array',
        'is_default' => 'boolean',
        'is_public' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
