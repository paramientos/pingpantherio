<?php

namespace App\Notifications;

use App\Models\DomainMonitor;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DomainExpiryAlert extends Notification
{
    use Queueable;

    public function __construct(
        protected DomainMonitor $domain,
        protected int $daysLeft
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $status = $this->daysLeft <= 7 ? 'URGENT' : 'Reminder';

        return (new MailMessage)
            ->subject("[{$status}] Domain Expiration Notice: {$this->domain->domain}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Your domain **{$this->domain->domain}** is set to expire in **{$this->daysLeft} days**.")
            ->line("Expiration Date: " . $this->domain->expires_at->format('M d, Y'))
            ->action('View Domain Status', url("/domains"))
            ->line('Please ensure your auto-renewal is active to prevent any service interruption.')
            ->error();
    }

    public function toArray(object $notifiable): array
    {
        return [
            'domain' => $this->domain->domain,
            'days_left' => $this->daysLeft,
            'expires_at' => $this->domain->expires_at,
            'type' => 'domain_expiry',
        ];
    }
}
