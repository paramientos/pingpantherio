<?php

namespace App\Concerns;

use Illuminate\Support\Str;
use ReflectionEnum;
use ReflectionException;

trait EnumToArray
{
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function array(): array
    {
        return array_combine(self::values(), self::names());
    }

    public static function reverseArray(): array
    {
        return array_combine(self::names(), self::values());
    }

    public static function valuesKeyPair(): array
    {
        return array_combine(self::values(), self::values());
    }

    public static function asTitle(): array
    {
        $values = [];

        foreach (self::valuesKeyPair() as $key => $value) {
            $values[$key] = ucfirst($value);
        }

        return $values;
    }

    public static function namesKeyPair(): array
    {
        return array_combine(self::names(), self::names());
    }

    public static function implode(string $glue = ','): string
    {
        return implode($glue, self::values());
    }

    /**
     * @throws ReflectionException
     */
    public static function tryFromName(string $name): ?static
    {
        $reflection = new ReflectionEnum(static::class);

        return $reflection->hasCase($name)
            ? $reflection->getCase($name)->getValue()
            : null;
    }

    public static function fromName(string $name): ?static
    {
        $reflection = new ReflectionEnum(static::class);

        return $reflection->getCase($name)->getValue();
    }

    public static function localize(array $excludeValues = []): array
    {
        $methodExists = method_exists(static::class, 'text');

        $options = [];

        foreach (self::cases() as $case) {
            if (in_array_recursive($case, $excludeValues)) {
                continue;
            }

            $options[$case->value] = $methodExists
                ? $case->text()
                : $case->name;
        }

        return $options;
    }

    public function to(string $method): ?string
    {
        if (!method_exists(Str::class, $method)) {
            return null;
        }

        return str($this->text())->{$method}();
    }

    public static function listForMaryUI(array $excludeValues = []): ?array
    {
        $items = self::localize($excludeValues);

        return collect($items)->map(fn ($val, $key) => [
            'id' => $key,
            'name' => $val,
        ])
            ->values()
            ->toArray();
    }
}
