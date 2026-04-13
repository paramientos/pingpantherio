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

### Method 1: Automated Setup (Recommended)

The fastest way to get PingPanther running is using our `dockerize.sh` script.

```bash
# 1. Clone the repo
git clone https://github.com/paramientos/pingpantherio.git
cd pingpantherio

# 2. Run the setup script
chmod +x dockerize.sh
./dockerize.sh
```

### Method 2: Manual Setup

If you prefer to run the commands manually:

```bash
# 1. Clone and setup environment
git clone https://github.com/paramientos/pingpantherio.git
cd pingpantherio
cp .env.example .env

# 2. Generate key and edit .env with your configuration
# Make sure to set DB_PASSWORD and REDIS_PASSWORD

# 3. Start containers
docker compose up -d
```

Detailed installation instructions can be found in the [Documentation](docs/installation.md).

#### 🔄 Rebuilding (Clean Build)

To rebuild from scratch:

```bash
./dockerize.sh
# OR
docker compose down && docker compose build --no-cache && docker compose up -d
```

---

## 📖 Documentation

- [Getting Started](docs/installation.md)
- [Configuration Guide](docs/configuration.md)
- [Docker Deployment](docs/installation.md#quick-start-docker-compose)
- [Advanced Usage](docs/configuration.md#feature-toggles)

---

## 🔧 Management Commands

PingPanther includes several useful Artisan commands for system administration:

### Password Reset
Reset any user's password interactively:
```bash
php artisan pp:reset-password
```

### Monitor Checks
Manually trigger monitor checks:
```bash
php artisan pp:monitors-check
```

### Data Pruning
Clean up old data (older than 1 month):
```bash
php artisan pp:prune
```

### Create Admin User
Create a new admin user:
```bash
php artisan pp:create-admin email@example.com password123
```

---

## 🛡 License

PingPanther is open-source software licensed under the [MIT license](LICENSE).

---

<p align="center">
  Built with ❤️ by Developers for Developers
</p>
