<?php

use Livewire\Volt\Volt;

Volt::route('/', 'dashboard');
Volt::route('/monitors', 'monitors.index');
Volt::route('/monitors/{monitor}', 'monitors.show')->name('monitors.show');
Volt::route('/users', 'users.index');
