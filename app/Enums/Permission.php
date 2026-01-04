<?php

namespace App\Enums;

enum Permission: string
{
    case VIEW_DASHBOARD = 'view_dashboard';
    case MANAGE_USERS = 'manage_users';
    case MANAGE_MONITORS = 'manage_monitors';
    case VIEW_INCIDENTS = 'view_incidents';
}
