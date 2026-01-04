<?php

namespace App\Concerns;

trait Toast
{
    public function toast(
        string  $type,
        string  $description,
        ?string $title = null,
        ?string $position = null,
        string  $icon = "<i class='fas fa-check-circle text-success'></i>",
        string  $css = 'alert-info',
        int     $timeout = 3000,
        ?string $redirectTo = null
    )
    {
        $toast = [
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'position' => $position,
            'css' => $css,
            'icon' => $icon,
            'timeout' => $timeout,
        ];

        $this->js('mgtoast(' . json_encode(['toast' => $toast]) . ')');

        session()->flash('mary.toast.title', $title);
        session()->flash('mary.toast.description', $description);

        if ($redirectTo) {
            return $this->redirect($redirectTo, navigate: true);
        }
    }

    public function success(
        string  $description,
        ?string $title = null,
        ?string $position = null,
        string  $icon = "<i class='fas fa-check-circle text-success'></i>",
        string  $css = 'alert-success',
        int     $timeout = 3000,
        ?string $redirectTo = null
    )
    {
        return $this->toast('success', $description, $title,$position, $icon, $css, $timeout, $redirectTo);
    }

    public function warning(
        string  $description,
        ?string $title = null,
        ?string $position = null,
        string  $icon = '<i class="fas fa-exclamation-triangle text-warning"></i>',
        string  $css = 'alert-warning',
        int     $timeout = 3000,
        ?string $redirectTo = null
    )
    {
        return $this->toast('warning', $description, $title, $position, $icon, $css, $timeout, $redirectTo);
    }

    public function error(
        string  $description,
        ?string $title = null,
        ?string $position = null,
        string  $icon = '<i class="fas fa-exclamation-triangle text-danger"></i>',
        string  $css = 'alert-error',
        int     $timeout = 3000,
        ?string $redirectTo = null
    )
    {
        return $this->toast('error', $description, $title, $position, $icon, $css, $timeout, $redirectTo);
    }

    public function info(
        string  $description,
        ?string $title = null,
        ?string $position = null,
        string  $icon = '<i class="fas fa-info-circle text-info"></i>',
        string  $css = 'alert-info',
        int     $timeout = 3000,
        ?string $redirectTo = null
    )
    {
        return $this->toast('info', $description, $title, $position, $icon, $css, $timeout, $redirectTo);
    }
}
