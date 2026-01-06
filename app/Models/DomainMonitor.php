<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $user_id
 * @property string $domain
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property \Illuminate\Support\Carbon|null $last_checked_at
 * @property array<array-key, mixed>|null $whois_data
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor whereDomain($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor whereLastCheckedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomainMonitor whereWhoisData($value)
 * @mixin \Eloquent
 */
class DomainMonitor extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'domain',
        'expires_at',
        'last_checked_at',
        'whois_data',
        'is_active',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'last_checked_at' => 'datetime',
        'whois_data' => 'array',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function daysUntilExpiry(): ?int
    {
        return $this->expires_at ? now()->diffInDays($this->expires_at, false) : null;
    }
}
