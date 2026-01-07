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
 * @property string $timezone
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OnCallRotation> $rotations
 * @property-read int|null $rotations_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallSchedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallSchedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallSchedule query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallSchedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallSchedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallSchedule whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallSchedule whereTimezone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallSchedule whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OnCallSchedule whereUserId($value)
 * @mixin \Eloquent
 */
class OnCallSchedule extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'timezone',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function rotations(): HasMany
    {
        return $this->hasMany(OnCallRotation::class, 'schedule_id')->orderBy('order_index');
    }

    public function getCurrentOnCallUser()
    {
        $rotations = $this->rotations()->with('user')->get();
        if ($rotations->isEmpty()) return null;

        // Simple duration-based rotation calculation
        // Total duration for one full cycle
        $totalDays = $rotations->sum('duration_days');
        if ($totalDays <= 0) return $rotations->first()->user;

        $daysSinceEpoch = now()->diffInDays(\Carbon\Carbon::create(2026, 1, 1)); // Reference date
        $dayInCycle = $daysSinceEpoch % $totalDays;

        $accumulatedDays = 0;
        foreach ($rotations as $rotation) {
            $accumulatedDays += $rotation->duration_days;
            if ($dayInCycle < $accumulatedDays) {
                return $rotation->user;
            }
        }

        return $rotations->first()->user;
    }
}
