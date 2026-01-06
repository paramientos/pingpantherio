<?php

namespace App\Notifications;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamInvitationNotification extends Notification
{
    use Queueable;

    public function __construct(protected Invitation $invitation) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = url("/invitations/{$this->invitation->token}/accept");

        return (new MailMessage)
            ->subject('Invitation to join ' . $this->invitation->team->name . ' on PingPanther')
            ->greeting('Hello!')
            ->line('You have been invited to join the team **' . $this->invitation->team->name . '** as a **' . $this->invitation->role . '**.')
            ->line('Click the button below to accept the invitation and start monitoring.')
            ->action('Accept Invitation', $url)
            ->line('This invitation will expire on ' . $this->invitation->expires_at->format('M d, Y'))
            ->line('If you were not expecting this invitation, you can safely ignore this email.');
    }
}
