<?php

namespace App\Enums;

enum MonitorStatus: string
{
    case UP = 'up';
    case DOWN = 'down';
    case PENDING = 'pending';
    case DISABLED = 'disabled';
    case MAINTENANCE = 'maintenance';

    public function label(): string
    {
        return match ($this) {
            self::UP => 'Up',
            self::DOWN => 'Down',
            self::PENDING => 'Pending',
            self::DISABLED => 'Disabled',
            self::MAINTENANCE => 'Maintenance',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::UP => 'green',
            self::DOWN => 'red',
            self::PENDING => 'orange',
            self::DISABLED => 'gray',
            self::MAINTENANCE => 'blue',
        };
    }
}
