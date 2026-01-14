# Post-Installation Configuration

After running the `install.sh` script, your PingPanther instance is ready for use. However, you might want to configure additional settings for production.

## 🔑 Admin Account Management

### Default Credentials (Demo Only)

- **Admin Email**: `admin@pingpanther.io`
- **Admin Password**: `password`

> **Warning**: These demo credentials are automatically removed during production installation. Your actual credentials are provided at the end of the installation process.

### Reset Password

If you forget your password or need to reset it, use the interactive password reset command:

```bash
cd /var/www/pingpanther
php artisan pp:reset-password
```

The command will prompt you for:
1. **Email address**: Enter the user's email
2. **New password**: Enter the new password (input is hidden for security)

Example:
```bash
$ php artisan pp:reset-password
Enter user email address: admin@example.com
User found: Admin User (admin@example.com)
Enter new password: ********
✓ Password successfully reset for user: Admin User (admin@example.com)
```

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
