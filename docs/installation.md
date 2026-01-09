# Installation Guide

PingPanther can be installed directly on a Ubuntu 24.04 LTS server (recommended) for maximum performance, or via Docker for simplified container management.

## 🚀 One-Command Installation (Recommended)

The easiest way to get PingPanther running on a fresh **Ubuntu 24.04 LTS** server is our unattended installation script. This will set up PHP 8.4, Nginx, PostgreSQL, Redis, Horizon, and SSL automatically.

### Requirements
- A fresh Ubuntu 24.04 LTS server.
- **Minimum:** 2GB RAM, 1 CPU core
- **Recommended:** 4GB RAM, 2 CPU cores
- Root access (sudo is not enough).
- A domain name (e.g., `status.example.com`) pointing to your server's IP (optional, for SSL).

### Installation
Run the following command as root:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/paramientos/pingpantherio/main/install.sh)
```

The installer will interactively prompt you for:
- **Domain name** (or it will use your server IP if you don't have one)
- **Admin email address**
- A secure password will be **auto-generated** and displayed at the end

### What this script does:
1.  **System Update:** Upgrades packages and installs core tools.
2.  **Stack Setup:** Installs PHP 8.4 (FPM/CLI), Nginx, PostgreSQL, and Redis.
3.  **App Provisioning:** Clones the app, installs Compose/Yarn dependencies, and builds assets.
4.  **Optimization:** Configures OPcache, Redis caching, and Laravel Horizon.
5.  **Security:** Configures UFW firewall and requests Let's Encrypt SSL (optional).
6.  **Persistence:** Sets up Systemd services for Horizon and Cron jobs for the Scheduler.

---

## 🐋 Docker Installation

If you prefer containerized environments, you can use our Docker setup.

### Prerequisites
- Docker & Docker Compose installed.

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/paramientos/pingpantherio.git
   cd pingpanther
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your domain and database credentials
   ```

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

---

## 🛠 Post-Installation

After installation completes, you can access your dashboard:
- **URL**: `http://your-ip` or `https://your-domain.com`
- **Email**: The email you provided during installation
- **Password**: The auto-generated password displayed at the end of installation

**💡 Important:** Save your credentials immediately! They are only shown once during installation.

### Post-Install Tasks

1.  **Change Password**: First thing you should do is login and change the administrator password.
2.  **Setup Notifications**: Configure your mail server or Slack/Discord webhooks in the Settings.
3.  **Define Escalation Policies**: Set up how alerts should be routed if initial responders are unavailable.

## 📝 Troubleshooting

- **Logs**: View application logs at `/var/www/pingpanther/storage/logs/laravel.log`
- **Horizon**: Access the Horizon dashboard at `/horizon` (Auth required).
- **Services**: Check service status:
  ```bash
  systemctl status nginx
  systemctl status postgresql
  systemctl status redis-server
  systemctl status pingpanther-horizon
  ```

---

*Need help? Open an issue on [GitHub](https://github.com/paramientos/pingpantherio/issues).*
