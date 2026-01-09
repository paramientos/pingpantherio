# 🐾 PingPanther

**PingPanther** is a modern, self-hosted uptime monitoring and incident management platform. Inspired by world-class tools like Better Uptime, it provides a powerful yet simple way to keep an eye on your services.

[![Self-Hosted](https://img.shields.io/badge/Self--Hosted-Ready-blueviolet?style=for-the-badge&logo=docker)](docs/installation.md)
[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🚀 Features

- **Real-time Monitoring**: HTTP, SSL, and Port monitoring with configurable intervals.
- **Incident Management**: Automated incident creation and status tracking.
- **Status Pages**: Beautiful, public-facing pages to communicate system health to your users.
- **Notifications**: Alerts via Email, Slack, Telegram, and more (coming soon).
- **Self-Healing**: Automated recovery actions when things go wrong.
- **Developer First**: Built with Laravel 12, InertiaJS, and React for a blazing-fast experience.

---

## 🛠 Tech Stack

- **Backend**: Laravel 12 (PHP 8.4)
- **Frontend**: Inertia.js + React + Mantine UI
- **Database**: PostgreSQL 16
- **Cache & Queue**: Redis 7
- **Server**: FrankenPHP (Caddy)

---

## 📦 Quick Start with Docker

The fastest way to get PingPanther running is using Docker Compose.

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/pingpantherio.git
cd pingpantherio

# 2. Setup environment
cp .env.example .env
# Edit .env with your configuration

# 3. Start PingPanther
docker-compose up -d
```

Detailed installation instructions can be found in the [Documentation](docs/installation.md).

---

## 📖 Documentation

- [Getting Started](docs/installation.md)
- [Configuration Guide](docs/configuration.md)
- [Docker Deployment](docs/installation.md#quick-start-docker-compose)
- [Advanced Usage](docs/configuration.md#feature-toggles)

---

## 🛡 License

PingPanther is open-source software licensed under the [MIT license](LICENSE).

---

<p align="center">
  Built with ❤️ by Developers for Developers
</p>
