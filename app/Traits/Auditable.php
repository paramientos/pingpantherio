<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function (Model $model) {
            self::logAudit($model, 'created');
        });

        static::updated(function (Model $model) {
            self::logAudit($model, 'updated');
        });

        static::deleted(function (Model $model) {
            self::logAudit($model, 'deleted');
        });
    }

    protected static function logAudit(Model $model, string $event): void
    {
        if (! Auth::check()) {
            return;
        }

        $oldValues = $event === 'updated' ? array_intersect_key($model->getOriginal(), $model->getChanges()) : null;
        $newValues = $event === 'updated' ? $model->getChanges() : $model->getAttributes();

        // Şifre veya gizli anahtar gibi alanları loglamayalım
        $forbidden = ['password', 'key', 'token', 'remember_token'];

        if ($oldValues) {
            $oldValues = array_diff_key($oldValues, array_flip($forbidden));
        }

        if ($newValues) {
            $newValues = array_diff_key($newValues, array_flip($forbidden));
        }

        AuditLog::create([
            'user_id' => Auth::id(),
            'event' => $event,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
