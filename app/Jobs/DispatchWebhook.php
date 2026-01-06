<?php

namespace App\Jobs;

use App\Models\Webhook;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class DispatchWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $backoff = [60, 300, 600];

    public function __construct(
        protected Webhook $webhook,
        protected string $event,
        protected array $payload
    ) {}

    public function handle(): void
    {
        $timestamp = now()->timestamp;
        $body = json_encode([
            'event' => $this->event,
            'timestamp' => $timestamp,
            'data' => $this->payload,
        ]);

        $headers = [
            'Content-Type' => 'application/json',
            'X-PingPanther-Event' => $this->event,
            'X-PingPanther-Delivery' => $this->job->getJobId(),
        ];

        // Eğer secret token varsa HMAC-SHA256 ile imzala
        if ($this->webhook->secret_token) {
            $signature = hash_hmac('sha256', $timestamp.'.'.$body, $this->webhook->secret_token);
            $headers['X-PingPanther-Signature'] = $signature;
        }

        $response = Http::withHeaders($headers)
            ->timeout(10)
            ->post($this->webhook->url, json_decode($body, true));

        if ($response->failed()) {
            throw new \Exception('Webhook failed with status: '.$response->status());
        }
    }
}
