<?php

namespace App\Exceptions;

use Exception;

class TooManyRequestsException extends Exception
{
    public float $minutesUntilAvailable;

    public function __construct(
        public $component,
        public $method,
        public $ip,
        public $secondsUntilAvailable,
    )
    {
        $this->minutesUntilAvailable = ceil($this->secondsUntilAvailable / 60);

        parent::__construct(sprintf(
            'Too many requests from [%s] to method [%s] on component: [%s]. Retry in %d seconds.',
            $this->ip,
            $this->method,
            $this->component,
            $this->secondsUntilAvailable,
        ));
    }
}
