# Post-Installation Configuration

After running the `install.sh` script, your PingPanther instance is ready for use. However, you might want to configure additional settings for production.

## 🔑 Default Credentials

- **Admin Email**: `admin@pingpanther.io`
- **Admin Password**: `password`

> **Warning**: Change these credentials immediately after your first login!

## 📧 Mail Settings

To receive email alerts, update your `.env` file located at `/var/www/pingpanther/.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="alerts@yourdomain.com"
MAIL_FROM_NAME="PingPanther Alerts"
```

After updating `.env`, clear the cache:
```bash
php artisan config:cache
```

## 🚨 Laravel Horizon

Horizon provides a beautiful dashboard and code-driven configuration for your Redis-powered queues.

- **Dashboard**: `https://yourdomain.com/horizon`
- **Service**: Managed via systemd as `pingpanther-horizon.service`.

To restart horizon after code changes:
```bash
sudo systemctl restart pingpanther-horizon
```

## ⏱ Scheduler

The Laravel scheduler handles monitor checks, SSL audits, and report generation. It is managed via a cron job file at `/etc/cron.d/pingpanther-scheduler`.

To see the scheduled tasks:
```bash
php artisan schedule:list
```

## 📦 Updating PingPanther

To update to the latest version:

```bash
cd /var/www/pingpanther
git pull origin main
composer install --no-dev --optimize-autoloader
yarn install
yarn build
php artisan migrate --force
php artisan optimize
sudo systemctl restart pingpanther-horizon
```

## 🛡 Firewall (UFW)

The installer configures UFW to allow SSH, HTTP, and HTTPS. You can check the status with:

```bash
sudo ufw status
```

If you need to allow additional ports (e.g., for custom integrations):
```bash
sudo ufw allow 8080/tcp
```
