<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string $type
 * @property string $frequency
 * @property array<array-key, mixed>|null $monitor_ids
 * @property array<array-key, mixed>|null $recipients
 * @property \Illuminate\Support\Carbon|null $last_sent_at
 * @property \Illuminate\Support\Carbon|null $next_send_at
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereLastSentAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereMonitorIds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereNextSendAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereRecipients($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Report whereUserId($value)
 * @mixin \Eloquent
 */
class Report extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'frequency',
        'monitor_ids',
        'recipients',
        'last_sent_at',
        'next_send_at',
        'is_active',
    ];

    protected $casts = [
        'monitor_ids' => 'array',
        'recipients' => 'array',
        'last_sent_at' => 'datetime',
        'next_send_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
