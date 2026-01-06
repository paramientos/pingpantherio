<?php

namespace App\Policies;

use App\Models\StatusPage;
use App\Models\User;

class StatusPagePolicy
{
    public function update(User $user, StatusPage $statusPage): bool
    {
        return $user->id === $statusPage->user_id;
    }

    public function delete(User $user, StatusPage $statusPage): bool
    {
        return $user->id === $statusPage->user_id;
    }
}
