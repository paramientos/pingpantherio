<?php

namespace App\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_CLASS)]
class Role
{
    public function __construct(public \App\Enums\Role|array $role, public string $guard = 'web')
    {
        //
    }
}
