FROM dunglas/frankenphp:1.3-php8.4-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    icu-dev \
    nodejs \
    yarn

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    pcntl \
    bcmath \
    gd \
    zip \
    intl

# Install Redis extension
RUN apk add --no-cache pcre-dev $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del pcre-dev $PHPIZE_DEPS

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy configuration files
COPY .frankenphp.Caddyfile /etc/caddy/Caddyfile

# Copy application files
COPY . .

# Install dependencies and build assets
RUN composer install --no-dev --optimize-autoloader --no-scripts
RUN yarn install --frozen-lockfile
RUN yarn build && rm -rf node_modules

# Set permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Expose port
EXPOSE 80 443 2019

# Entrypoint
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
