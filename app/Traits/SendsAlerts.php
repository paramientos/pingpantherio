<?php

namespace App\Traits;

use App\Notifications\IncidentAlert;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

trait SendsAlerts
{
    protected function sendAlertToChannel($channel, $monitor, $incident, string $type = 'started'): void
    {
        $channelType = $channel->type;
        $config = $channel->config;

        try {
            match ($channelType) {
                'email' => $channel->user->notify(new IncidentAlert($monitor, $incident, $type)),
                'slack' => $this->sendToSlack($config['webhook_url'] ?? '', $monitor, $incident, $type),
                'discord' => $this->sendToDiscord($config['webhook_url'] ?? '', $monitor, $incident, $type),
                'telegram' => $this->sendToTelegram($config['bot_token'] ?? '', $config['chat_id'] ?? '', $monitor, $incident, $type),
                'webhook' => $this->sendToWebhook($config['url'] ?? '', $monitor, $incident, $type),
                default => Log::warning("Unknown alert channel type: {$channelType}"),
            };
        } catch (\Exception $e) {
            Log::error("Failed to send alert to channel {$channel->id}: " . $e->getMessage());
        }
    }

    protected function sendAlertToUser($user, $monitor, $incident, string $type = 'started'): void
    {
        try {
            $user->notify(new IncidentAlert($monitor, $incident, $type));
        } catch (\Exception $e) {
            Log::error("Failed to send alert to user {$user->id}: " . $e->getMessage());
        }
    }

    protected function sendToSlack(string $url, $monitor, $incident, string $type): void
    {
        if (empty($url)) return;

        $message = $type === 'resolved' 
            ? "✅ *{$monitor->name}* is BACK ONLINE!\nURL: {$monitor->url}"
            : "🚨 *{$monitor->name}* is DOWN!\nURL: {$monitor->url}\nError: {$incident->error_message}";

        Http::post($url, ['text' => $message]);
    }

    protected function sendToDiscord(string $url, $monitor, $incident, string $type): void
    {
        if (empty($url)) return;

        $message = $type === 'resolved' 
            ? "✅ **{$monitor->name}** is BACK ONLINE!\nURL: {$monitor->url}"
            : "🚨 **{$monitor->name}** is DOWN!\nURL: {$monitor->url}\nError: {$incident->error_message}";

        Http::post($url, ['content' => $message]);
    }

    protected function sendToTelegram(string $token, string $chatId, $monitor, $incident, string $type): void
    {
        if (empty($token) || empty($chatId)) return;

        $message = $type === 'resolved' 
            ? "✅ {$monitor->name} is BACK ONLINE!\nURL: {$monitor->url}"
            : "🚨 {$monitor->name} is DOWN!\nURL: {$monitor->url}\nError: {$incident->error_message}";

        $url = "https://api.telegram.org/bot{$token}/sendMessage";
        Http::post($url, [
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => 'HTML',
        ]);
    }

    protected function sendToWebhook(string $url, $monitor, $incident, string $type): void
    {
        if (empty($url)) return;

        Http::post($url, [
            'event' => $type === 'resolved' ? 'incident.resolved' : 'incident.started',
            'monitor' => [
                'id' => $monitor->id,
                'name' => $monitor->name,
                'url' => $monitor->url,
            ],
            'incident' => [
                'id' => $incident->id,
                'error' => $incident->error_message,
                'started_at' => $incident->started_at,
                'resolved_at' => $incident->resolved_at,
            ],
        ]);
    }
}
