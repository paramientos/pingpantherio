<?php

use App\Enums\Permission;
use App\Enums\Role;
use App\Models\User;
use Random\RandomException;

if (! function_exists('get_real_ip')) {
    function get_real_ip(): mixed
    {
        $server = request()->server;

        if (! empty($server->get('HTTP_CF_CONNECTING_IP'))) {
            $ip = $server->get('HTTP_CF_CONNECTING_IP');
        } elseif (! empty($server->get('HTTP_CLIENT_IP'))) {
            $ip = $server->get('HTTP_CLIENT_IP');
        } elseif (! empty($server->get('HTTP_X_FORWARDED_FOR'))) {
            $ip = $server->get('HTTP_X_FORWARDED_FOR');

            if (str_contains($ip, ',')) {
                $ipArray = explode(',', $ip);
                $ip = reset($ipArray);
            }
        } else {
            $ip = $server->get('REMOTE_ADDR');
        }

        return $ip;
    }
}

if (! function_exists('in_array_recursive')) {
    function in_array_recursive($needle, $haystack, $strict = false): bool
    {
        foreach ($haystack as $item) {
            if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && in_array_recursive($needle, $item, $strict))) {
                return true;
            }
        }

        return false;
    }
}

function check_permission(string|Permission $permission, string $guard = 'web'): bool
{
    if ($permission instanceof Permission) {
        $permission = $permission->value;
    }

    $user = auth($guard)->user();

    if (! $user) {
        return false;
    }

    if ($user->role->isAdmin()) {
        return true;
    }

    $permissions = $user->permissions;

    if (empty($permissions)) {
        return false;
    }

    return in_array($permission, $permissions);
}

function is_role_suitable(array $roles, string $guard = 'web'): bool
{
    $user = auth($guard)->user();

    if (! $user) {
        return false;
    }

    return array_any($roles, fn (string $role) => $user->role->value === $role);
}

/**
 * @throws Exception
 */
function get_role(?User $user = null, string $guard = 'web'): Role
{
    if (is_null($user)) {
        $user = auth($guard)->user();
    }

    if (is_null($user)) {
        throw new Exception('User not found');
    }

    return $user->role;
}

function mai_decode_license_key(string $licenseKey): ?array
{
    try {
        $licenseEncKey = config('mai.license_encryption_key');

        if (! $licenseEncKey) {
            return null;
        }

        $decrypted = openssl_decrypt($licenseKey, 'AES-256-CBC', $licenseEncKey, 0, substr(md5($licenseEncKey), 0, 16));

        if (! $decrypted) {
            return null;
        }

        $data = json_decode($decrypted, true);

        if (! isset($data['c'], $data['sd'], $data['sd'], $data['ed'], $data['mi'])) {
            return null;
        }

        return $data;
    } catch (Exception $e) {
        Log::error('License decode error: '.$e->getMessage());

        return null;
    }
}

/**
 * @throws RandomException
 */
function mai_generate_secure_password(int $len = 16): string
{
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    $password = '';

    for ($i = 0; $i < $len; $i++) {
        $password .= $characters[random_int(0, strlen($characters) - 1)];
    }

    return $password;
}

function mai_calculate_password_strength(string $password): array
{
    $score = 0;
    $length = strlen($password);

    if ($length >= 8) {
        $score += 20;
    }
    if ($length >= 12) {
        $score += 20;
    }
    if ($length >= 16) {
        $score += 10;
    }

    if (preg_match('/[a-z]/', $password)) {
        $score += 10;
    }
    if (preg_match('/[A-Z]/', $password)) {
        $score += 10;
    }
    if (preg_match('/[0-9]/', $password)) {
        $score += 15;
    }
    if (preg_match('/[^a-zA-Z0-9]/', $password)) {
        $score += 15;
    }

    if ($score < 40) {
        return ['label' => 'Weak', 'percentage' => $score, 'color' => '#EF4444'];
    } elseif ($score < 70) {
        return ['label' => 'Medium', 'percentage' => $score, 'color' => '#F59E0B'];
    } else {
        return ['label' => 'Strong', 'percentage' => $score, 'color' => '#10B981'];
    }
}

function mai_hard_logout(): void
{
    auth('web')->logout();

    session()->invalidate();
    session()->regenerateToken();
}
