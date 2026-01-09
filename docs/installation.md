# Self-Hosting PingPanther

PingPanther can be easily self-hosted using Docker. This guide will help you get your instance up and running in minutes.

## Prerequisites

- Docker and Docker Compose installed on your server.
- A domain name (optional but recommended for SSL).
- SMTP credentials for notifications (Email).

## Quick Start (Docker Compose)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/pingpanther.git
   cd pingpanther
   ```

2. **Prepare environment variables:**

   Copy the example environment file and generate an application key.

   ```bash
   cp .env.example .env
   ```

   Open `.env` and configure at least the following:
   - `APP_KEY`: Run `php artisan key:generate --show` locally or use a secure random string.
   - `APP_URL`: Your public URL (e.g., `https://ping.example.com`).
   - `DB_PASSWORD`: Set a secure password for Postgres.
   - `REDIS_PASSWORD`: Set a secure password for Redis.

3. **Start the containers:**

   ```bash
   docker-compose up -d
   ```

4. **Access the application:**

   Once the containers are running, you can access PingPanther at `http://localhost:8080` (or the port you configured).

## Advanced Configuration

### Using a Reverse Proxy

If you want to use your own reverse proxy (like Nginx Proxy Manager, Traefik, or Caddy) to handle SSL:

1. Update the `APP_URL` in your `.env` to use `https`.
2. Configure your reverse proxy to point to the `app` service on port `80`.

### Database Backups

It is highly recommended to regularly back up the `postgres_data` volume. You can use tools like `pg_dump` or volume backup utilities.

### Horizontal Scaling

PingPanther is designed to be stateless (except for storage). You can scale the `app` and `worker` services as needed:

```bash
docker-compose up -d --scale app=3 --scale worker=2
```

## Troubleshooting

- **Check logs:** `docker-compose logs -f app`
- **Restart services:** `docker-compose restart`
- **Rebuild image:** `docker-compose build --no-cache app`
