#!/bin/bash
set -e

# Check if APP_KEY is set
if [ -z "$APP_KEY" ]; then
    echo "ERROR: APP_KEY is not set. Please set it in your environment variables."
    exit 1
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
