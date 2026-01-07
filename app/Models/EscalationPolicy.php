<?php

namespace App\Models;

use Illuminate\Database\Entity\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Monitor> $monitors
 * @property-read int|null $monitors_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\EscalationRule> $rules
 * @property-read int|null $rules_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationPolicy newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationPolicy newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationPolicy query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationPolicy whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationPolicy whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationPolicy whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationPolicy whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationPolicy whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EscalationPolicy whereUserId($value)
 * @mixin \Eloquent
 */
class EscalationPolicy extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'description',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rules(): HasMany
    {
        return $this->hasMany(EscalationRule::class)->orderBy('position');
    }

    public function monitors(): HasMany
    {
        return $this->hasMany(Monitor::class);
    }
}
