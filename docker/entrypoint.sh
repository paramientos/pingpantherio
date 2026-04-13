#!/bin/bash
set -e

# Check if APP_KEY is set, generate if empty
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY not set, generating new key..."
    APP_KEY=$(php artisan key:generate --show --no-interaction 2>/dev/null | tail -1)
    if [ -n "$APP_KEY" ]; then
        # Update APP_KEY in .env file (works with mounted files)
        if grep -q "^APP_KEY=" /app/.env 2>/dev/null; then
            awk -v key="$APP_KEY" '/^APP_KEY=/{print "APP_KEY=" key; next}1' /app/.env > /tmp/.env.tmp && cat /tmp/.env.tmp > /app/.env && rm /tmp/.env.tmp
        else
            echo "APP_KEY=$APP_KEY" >> /app/.env
        fi
        export APP_KEY
        echo "Generated and saved APP_KEY to .env"
    else
        echo "ERROR: Failed to generate APP_KEY"
        exit 1
    fi
fi

# Cache configuration, routes, and views
if [ "$APP_ENV" = "production" ]; then
    echo "🚀 Starting PingPanther in production mode..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
else
    echo "🛠 Starting PingPanther in $APP_ENV mode..."
fi

# Run migrations if enabled
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force
    
    # Run seeders if database is empty
    USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();")
    if [ "$USER_COUNT" = "0" ]; then
        echo "Seeding database..."
        php artisan db:seed --force
    fi
fi

# Link storage
if [ ! -L public/storage ]; then
    echo "Linking storage..."
    php artisan storage:link
fi

# Execution mode
if [ "$1" = "frankenphp" ]; then
    exec "$@"
elif [ "$1" = "worker" ]; then
    echo "Starting worker..."
    exec php artisan queue:work --verbose --tries=3 --timeout=90
elif [ "$1" = "scheduler" ]; then
    echo "Starting scheduler..."
    while [ true ]
    do
      php artisan schedule:run --verbose --no-interaction &
      sleep 60
    done
else
    exec "$@"
fi
