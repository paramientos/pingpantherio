# Configuration

PingPanther is configured using environment variables. You can set these in your `.env` file or directly in your `docker-compose.yml`.

## Core Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | The name of your instance. | PingPanther |
| `APP_ENV` | Environment (production/local). | `production` |
| `APP_KEY` | Application secret key. | (None) |
| `APP_DEBUG` | Enable debug mode (not recommended for production). | `false` |
| `APP_URL` | The public URL of your instance. | `http://localhost` |

## Database (PostgreSQL)

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host. | `postgres` |
| `DB_PORT` | Database port. | `5432` |
| `DB_DATABASE` | Database name. | `pingpanther` |
| `DB_USERNAME` | Database user. | `postgres` |
| `DB_PASSWORD` | Database password. | (None) |

## Redis

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_HOST` | Redis host. | `redis` |
| `REDIS_PASSWORD` | Redis password. | (None) |
| `REDIS_PORT` | Redis port. | `6379` |

## Mail Configuration

To receive notifications, you must configure an SMTP server.

| Variable | Description |
|----------|-------------|
| `MAIL_MAILER` | Mailer driver (smtp, ses, mailgun). |
| `MAIL_HOST` | SMTP host. |
| `MAIL_PORT` | SMTP port. |
| `MAIL_USERNAME` | SMTP username. |
| `MAIL_PASSWORD` | SMTP password. |
| `MAIL_ENCRYPTION` | Encryption (tls/ssl). |
| `MAIL_FROM_ADDRESS` | From email address. |
| `MAIL_FROM_NAME` | From name. |

## Feature Toggles

| Variable | Description | Default |
|----------|-------------|---------|
| `REGISTRATION_ENABLED` | Allow new users to register. | `true` |
| `DEMO_MODE` | Enable demo mode (read-only). | `false` |
