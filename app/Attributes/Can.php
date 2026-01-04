<?php

namespace App\Attributes;

use App\Enums\Permission;
use Attribute;

#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_CLASS)]
class Can
{
    public function __construct(public Permission|array $permissions, public string $guard = 'web', public bool $requireAll = false)
    {
        //
    }
}
