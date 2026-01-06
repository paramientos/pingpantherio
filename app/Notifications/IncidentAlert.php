<?php

namespace App\Notifications;

use App\Models\Incident;
use App\Models\Monitor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IncidentAlert extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Monitor $monitor,
        public Incident $incident,
        public string $type = 'started'
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        if ($this->type === 'resolved') {
            return $this->resolvedMail($notifiable);
        }

        return (new MailMessage)
            ->error()
            ->subject("🚨 {$this->monitor->name} is DOWN")
            ->greeting("Monitor Alert: {$this->monitor->name}")
            ->line("Your monitor **{$this->monitor->name}** is currently down.")
            ->line("**URL:** {$this->monitor->url}")
            ->line("**Error:** {$this->incident->error_message}")
            ->line("**Started at:** {$this->incident->started_at->format('Y-m-d H:i:s')}")
            ->action('View Monitor', url("/monitors/{$this->monitor->getKey()}"))
            ->line('We will notify you when the monitor is back online.');
    }

    protected function resolvedMail(object $notifiable): MailMessage
    {
        $duration = $this->incident->started_at->diffForHumans($this->incident->resolved_at, true);

        return (new MailMessage)
            ->success()
            ->subject("✅ {$this->monitor->name} is BACK ONLINE")
            ->greeting("Monitor Recovered: {$this->monitor->name}")
            ->line("Your monitor **{$this->monitor->name}** is back online.")
            ->line("**URL:** {$this->monitor->url}")
            ->line("**Downtime:** {$duration}")
            ->line("**Resolved at:** {$this->incident->resolved_at->format('Y-m-d H:i:s')}")
            ->action('View Monitor', url("/monitors/{$this->monitor->getKey()}"))
            ->line('Thank you for using PingPanther!');
    }
}
