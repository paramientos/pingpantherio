<?php

namespace App\Notifications;

use App\Models\Monitor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SslExpiryAlert extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Monitor $monitor,
        public int $daysUntilExpiry
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $urgency = $this->daysUntilExpiry <= 7 ? 'URGENT' : 'WARNING';
        $color = $this->daysUntilExpiry <= 7 ? 'error' : 'warning';

        return (new MailMessage)
            ->{$color}()
            ->subject("🔒 {$urgency}: SSL Certificate Expiring Soon - {$this->monitor->name}")
            ->greeting("SSL Certificate Alert")
            ->line("The SSL certificate for **{$this->monitor->name}** is expiring soon.")
            ->line("**URL:** {$this->monitor->url}")
            ->line("**Days Until Expiry:** {$this->daysUntilExpiry} days")
            ->line("**Expires At:** {$this->monitor->ssl_expires_at->format('Y-m-d H:i:s')}")
            ->line("**Issuer:** {$this->monitor->ssl_issuer}")
            ->action('View Monitor', url("/monitors/{$this->monitor->getKey()}"))
            ->line('Please renew your SSL certificate as soon as possible to avoid service disruption.');
    }
}
