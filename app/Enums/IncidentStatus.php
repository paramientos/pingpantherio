<?php

namespace App\Enums;

enum IncidentStatus: string
{
    case OPEN = 'open';
    case RESOLVED = 'resolved';
    case ACKNOWLEDGED = 'acknowledged';

    public function label(): string
    {
        return match ($this) {
            self::OPEN => 'Open',
            self::RESOLVED => 'Resolved',
            self::ACKNOWLEDGED => 'Acknowledged',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::OPEN => 'red',
            self::RESOLVED => 'green',
            self::ACKNOWLEDGED => 'orange',
        };
    }
}
