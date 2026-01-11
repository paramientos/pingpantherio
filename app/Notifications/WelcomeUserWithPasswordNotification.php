<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeUserWithPasswordNotification extends Notification
{
    use Queueable;

    protected $password;
    protected $mustChangePassword;

    /**
     * Create a new notification instance.
     */
    public function __construct($password, $mustChangePassword)
    {
        $this->password = $password;
        $this->mustChangePassword = $mustChangePassword;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Your PingPanther Account Has Been Created')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Welcome to the PingPanther platform. Your account has been created by an administrator.')
            ->line('Your login details are below:')
            ->line('**Email:** ' . $notifiable->email)
            ->line('**Temporary Password:** ' . $this->password);

        if ($this->mustChangePassword) {
            $message->line('**Note:** For your security, you must change your password upon your first login.');
        }

        return $message
            ->action('Login', url('/login'))
            ->line('We wish you uninterrupted monitoring with PingPanther!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
