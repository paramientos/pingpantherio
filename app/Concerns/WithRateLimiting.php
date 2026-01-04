<?php

namespace App\Concerns;

use App\Exceptions\TooManyRequestsException;
use Illuminate\Support\Facades\RateLimiter;
use ReflectionClass;

trait WithRateLimiting
{
    protected const bool SKIP_ON_LOCAL = true;

    protected function clearRateLimiter($method = null, $component = null): void
    {
        $method ??= debug_backtrace(limit: 2)[1]['function'];

        $component ??= $this->getComponentName();

        $key = $this->getRateLimitKey($method, $component);

        RateLimiter::clear($key);
    }

    protected function getRateLimitKey($method, $component = null): string
    {
        $method ??= debug_backtrace(limit: 2)[1]['function'];

        $component ??= $this->getComponentName();

        return sha1($component . '|' . $method . '|' . get_real_ip());
    }

    protected function hitRateLimiter($method = null, $decaySeconds = 60, $component = null): void
    {
        $method ??= debug_backtrace(limit: 2)[1]['function'];

        $component ??= $this->getComponentName();

        $key = $this->getRateLimitKey($method, $component);

        RateLimiter::hit($key, $decaySeconds);
    }

    /**
     * @throws TooManyRequestsException
     */
    protected function rateLimit($maxAttempts, $decaySeconds = 60, $method = null, $component = null, bool $forcePolicyOnLocal = false): void
    {
        if (!$forcePolicyOnLocal && self::SKIP_ON_LOCAL && config('app.env') === 'local') {
            return;
        }

        $method ??= debug_backtrace(limit: 2)[1]['function'];

        $component ??= $this->getComponentName();

        $key = $this->getRateLimitKey($method, $component);

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $ip = get_real_ip();
            $secondsUntilAvailable = RateLimiter::availableIn($key);

            throw new TooManyRequestsException($component, $method, $ip, $secondsUntilAvailable);
        }

        $this->hitRateLimiter($method, $decaySeconds, $component);
    }

    protected function getComponentName(): string
    {
        $reflection = new ReflectionClass($this);
        $fullName = $reflection->getName();

        if (str_contains($fullName, '@anonymous')) {
            // Extract the file path and line number
            preg_match('/@anonymous\x00?(.+):(\d+)/', $fullName, $matches);
            if (isset($matches[1]) && isset($matches[2])) {
                $filePath = $matches[1];

                // Remove leading null byte if present
                return ltrim($filePath, "\0");
            }
        }

        return static::class;
    }

    protected function rateLimitOrWarn(int $max, string $message, bool $forcePolicyOnLocal = false): bool
    {
        try {
            $this->rateLimit($max, forcePolicyOnLocal: $forcePolicyOnLocal);
            return true;
        } catch (TooManyRequestsException $e) {
            if (is_subclass_of($this, \Mary\Traits\Toast::class) || is_subclass_of($this, \App\Concerns\Toast::class)) {
                $this->warning(str_replace('{seconds}', $e->secondsUntilAvailable, $message));
            }

            return false;
        }
    }
}
