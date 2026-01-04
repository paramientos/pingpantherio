<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class AppBrand extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return <<<'HTML'
                <a href="/" wire:navigate>
                    <!-- Hidden when collapsed -->
                    <div {{ $attributes->class(["hidden-when-collapsed"]) }}>
                        <div class="flex items-center gap-3 w-fit">
                            <div class="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/30">
                                <x-icon name="fas.bolt" class="w-6 h-6 text-white" />
                            </div>
                            <span class="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                                Ping<span class="text-primary">Panther</span>
                            </span>
                        </div>
                    </div>

                    <!-- Display when collapsed -->
                    <div class="display-when-collapsed hidden mx-5 mt-5 mb-1">
                        <div class="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/30 w-fit">
                            <x-icon name="fas.bolt" class="w-6 h-6 text-white" />
                        </div>
                    </div>
                </a>
            HTML;
    }
}
