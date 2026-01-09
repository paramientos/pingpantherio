# Getting Started with PingPanther

Welcome to PingPanther! This guide will walk you through the first steps after you've installed your instance.

## 1. Initial Setup

After running `docker-compose up -d`, visit your instance URL.

- **Create Administrator Account**: The first thing you should do is register your administrator account.
- **Configure SMTP**: Go to settings and ensure your SMTP settings are working so you can receive alerts.

## 2. Adding your first Monitor

1. Click on **Add Monitor**.
2. **Name**: Give it a descriptive name (e.g., "Main Website").
3. **URL**: Enter the full URL (e.g., `https://example.com`).
4. **Interval**: Choose how often we should check the service (default is 1 minute).
5. **Recovery Actions**: Optionally, add a webhook to trigger a self-healing action if the service goes down.

## 3. Setting up Status Pages

Status pages allow you to communicate with your customers during outages.

1. Go to **Status Pages**.
2. Create a new page.
3. Select which monitors should be displayed on this page.
4. Customise the branding (Logo, Colors).
5. Share the public URL with your users.

## 4. Configuring Notifications

PingPanther supports multiple notification channels:

- **Email**: Sent to the email address associated with your account.
- **Slack/Discord**: (Coming soon) Configure webhooks to receive alerts in your chat rooms.
- **Telegram**: (Coming soon) Connect your bot to get instant notifications on your phone.

## 5. Next Steps

- Explore the **Dashboard** for a bird's-eye view of all your services.
- Check the **Incidents** tab to see past outages and their duration.
- Set up **Maintenance Windows** to avoid false alerts during scheduled updates.
