<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;
use App\Traits\Auditable;

/**
 * @property string $id
 * @property string $user_id
 * @property string $name
 * @property string $slug
 * @property string|null $logo_url
 * @property string|null $description
 * @property string|null $custom_domain
 * @property bool $is_public
 * @property bool $show_uptime
 * @property bool $show_incidents
 * @property array<array-key, mixed>|null $theme_colors
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $favicon_url
 * @property string|null $branding
 * @property bool $hide_branding
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Monitor> $monitors
 * @property-read int|null $monitors_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereBranding($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereCustomDomain($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereFaviconUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereHideBranding($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereIsPublic($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereLogoUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereShowIncidents($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereShowUptime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereThemeColors($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatusPage whereUserId($value)
 * @mixin \Eloquent
 */
class StatusPage extends Model
{
    use HasUuids, Auditable;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'logo_url',
        'description',
        'custom_domain',
        'favicon_url',
        'is_public',
        'show_uptime',
        'show_incidents',
        'hide_branding',
        'theme_colors',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'show_uptime' => 'boolean',
        'show_incidents' => 'boolean',
        'hide_branding' => 'boolean',
        'theme_colors' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($statusPage) {
            if (empty($statusPage->slug)) {
                $statusPage->slug = Str::slug($statusPage->name);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function monitors(): BelongsToMany
    {
        return $this->belongsToMany(Monitor::class)
            ->withPivot('display_order')
            ->orderBy('display_order');
    }


}
