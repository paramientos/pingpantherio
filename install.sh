#!/bin/bash

# =================================================================0
# PingPanther - Unattended Installation Script for Ubuntu 24.04
# =================================================================0
# This script installs PHP 8.4, Nginx, PostgreSQL, Redis, Node.js 22,
# and configures the host to run PingPanther directly.
# =================================================================0

set -e

# --- Configuration ---
PROJECT_NAME="pingpanther"
INSTALL_DIR="/var/www/$PROJECT_NAME"
DB_NAME="pingpanther"
DB_USER="panther"
DB_PASS=$(openssl rand -base64 12)

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# --- Banner ---
clear
echo -e "${CYAN}"
echo "    ____  _             ____                __  __               "
echo "   / __ \(_)___  ____ _/ __ \____ _____  / /_/ /_  ___  _____  "
echo "  / /_/ / / __ \/ __ \`/ /_/ / __ \`/ __ \/ __/ __ \/ _ \/ ___/  "
echo " / ____/ / / / / /_/ / ____/ /_/ / / / / /_/ / / /  __/ /      "
echo "/_/   /_/_/ /_/\__, /_/    \__,_/_/ /_/\__/_/ /_/\___/_/       "
echo "              /____/                                           "
echo -e "${NC}"
echo -e "${BLUE}>>> Starting Installation for Ubuntu 24.04 <<<${NC}\n"

# --- Interactive Domain Setup ---
echo -e "${YELLOW}[SETUP] Domain Configuration${NC}"
echo ""
read -p "Do you have a domain name for this installation? (yes/no): " has_domain < /dev/tty

if [[ "$has_domain" =~ ^[Yy]([Ee][Ss])?$ ]]; then
    read -p "Enter your domain name (e.g., status.example.com): " APP_DOMAIN < /dev/tty
    echo -e "${GREEN}✓ Using domain: $APP_DOMAIN${NC}"
else
    APP_DOMAIN=$(hostname -I | awk '{print $1}')
    echo -e "${BLUE}ℹ No domain provided. Using server IP: $APP_DOMAIN${NC}"
    echo -e "${YELLOW}⚠ SSL certificates will not be installed without a domain.${NC}"
fi

echo ""
echo -e "${CYAN}Installation Summary:${NC}"
echo -e "  Domain/IP: ${GREEN}$APP_DOMAIN${NC}"
echo -e "  Install Path: ${GREEN}$INSTALL_DIR${NC}"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..." < /dev/tty
echo ""

# --- Root Check ---
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Error: You need to run the command via root user!${NC}"
  exit 1
fi

# 1. Update System
echo -e "${YELLOW}[1/12] Updating system packages...${NC}"
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get upgrade -y
apt-get install -y curl zip unzip git gnupg2 ca-certificates lsb-release apt-transport-https software-properties-common build-essential certbot python3-certbot-nginx

# 2. Add Repositories
echo -e "${YELLOW}[2/12] Adding PHP and Node.js repositories...${NC}"
# PHP PPA
add-apt-repository -y ppa:ondrej/php
# NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

apt-get update

# 3. Install PHP 8.4
echo -e "${YELLOW}[3/12] Installing PHP 8.4 and extensions...${NC}"
apt-get install -y php8.4-fpm php8.4-cli php8.4-pgsql php8.4-redis \
    php8.4-gd php8.4-intl php8.4-zip php8.4-bcmath php8.4-mbstring \
    php8.4-xml php8.4-curl php8.4-opcache

# 4. Install Nginx, Redis, PostgreSQL
echo -e "${YELLOW}[4/12] Installing Web Server, Redis and Database...${NC}"
apt-get install -y nginx redis-server postgresql postgresql-contrib

# 5. Configure PostgreSQL
echo -e "${YELLOW}[5/12] Configuring Database...${NC}"
# Check if database already exists
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
if [ "$DB_EXISTS" != "1" ]; then
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" || true
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
else
    echo -e "${BLUE}Database already exists, skipping creation.${NC}"
fi

# 6. Install Composer & Node/Yarn
echo -e "${YELLOW}[6/12] Installing Composer, Node.js and Yarn...${NC}"
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# Node already added to repo in step 2
apt-get install -y nodejs
# Use corepack to enable yarn (avoids npm global permission issues)
corepack enable
corepack prepare yarn@stable --activate

# 7. Setup Directory

# Check if directory exists and is a git repo
if [ -d "$INSTALL_DIR/.git" ]; then
    echo -e "${BLUE}Existing installation detected. Updating...${NC}"
    cd "$INSTALL_DIR"
    git fetch --tags
else
    echo -e "${BLUE}Cloning repository...${NC}"
    # Ensure directory exists but is empty or doesn't exist to avoid clone errors
    if [ -d "$INSTALL_DIR" ]; then
        if [ "$(ls -A $INSTALL_DIR)" ]; then
             echo -e "${YELLOW}Directory $INSTALL_DIR exists and is not empty. Backing up...${NC}"
             mv "$INSTALL_DIR" "${INSTALL_DIR}_backup_$(date +%s)"
        fi
    fi
    git clone https://github.com/paramientos/pingpantherio.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

# Get latest tag
LATEST_TAG=$(git describe --tags `git rev-list --tags --max-count=1`)
echo -e "${GREEN}Detected latest version: $LATEST_TAG${NC}"

# Checkout latest tag
git checkout "$LATEST_TAG" || echo -e "${YELLOW}Could not checkout tag $LATEST_TAG, staying on main branch.${NC}"

cd "$INSTALL_DIR"

# 8. Environment Configuration
echo -e "${YELLOW}[8/12] Configuring Environment...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    sed -i "s|APP_NAME=Laravel|APP_NAME=PingPanther|g" .env
    sed -i "s|APP_ENV=local|APP_ENV=production|g" .env
    sed -i "s|APP_DEBUG=true|APP_DEBUG=false|g" .env
    sed -i "s|APP_URL=http://localhost|APP_URL=http://$APP_DOMAIN|g" .env
    sed -i "s|DB_CONNECTION=sqlite|DB_CONNECTION=pgsql|g" .env
    sed -i "s|# DB_HOST=127.0.0.1|DB_HOST=127.0.0.1|g" .env
    sed -i "s|# DB_PORT=5432|DB_PORT=5432|g" .env
    sed -i "s|# DB_DATABASE=laravel|DB_DATABASE=$DB_NAME|g" .env
    sed -i "s|# DB_USERNAME=root|DB_USERNAME=$DB_USER|g" .env
    sed -i "s|# DB_PASSWORD=|DB_PASSWORD=$DB_PASS|g" .env
    sed -i "s|SESSION_DRIVER=database|SESSION_DRIVER=redis|g" .env
    sed -i "s|CACHE_STORE=database|CACHE_STORE=redis|g" .env
    sed -i "s|QUEUE_CONNECTION=database|QUEUE_CONNECTION=redis|g" .env
    # Key generation moved to after composer install
else
    echo -e "${BLUE}.env already exists, skipping generation.${NC}"
fi

# 9. Install Dependencies
echo -e "${YELLOW}[9/12] Installing PHP & Frontend dependencies...${NC}"
composer install --no-dev --optimize-autoloader --no-interaction
yarn install
yarn build

# Generate Application Key (now that composer install is done)
if [ ! -f ".env" ] || ! grep -q "^APP_KEY=base64:" .env; then
    echo -e "${YELLOW}Generating Application Key...${NC}"
    php artisan key:generate --force
fi

# 10. Database Migrations & Admin User Creation
echo -e "${YELLOW}[10/12] Initializing Database & Creating Admin User...${NC}"
php artisan migrate --force

# Create admin user interactively
echo ""
echo -e "${CYAN}=== Admin Account Setup ===${NC}"
read -p "Enter admin email address: " ADMIN_EMAIL < /dev/tty
ADMIN_PASSWORD=$(openssl rand -base64 16)

php artisan user:create-admin "$ADMIN_EMAIL" "$ADMIN_PASSWORD"

echo -e "${GREEN}✓ Admin account created!${NC}"
echo -e "${YELLOW}⚠ Save these credentials:${NC}"
echo -e "  Email: ${GREEN}$ADMIN_EMAIL${NC}"
echo -e "  Password: ${GREEN}$ADMIN_PASSWORD${NC}"
echo ""

php artisan horizon:install --force

# Optimize for production
echo -e "${YELLOW}Optimizing application for production...${NC}"
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Detect Target User (VitoDeploy support)
if id "vito" &>/dev/null; then
    WEB_USER="vito"
    WEB_GROUP="vito"
    echo -e "${BLUE}Detected 'vito' user, setting as owner.${NC}"
else
    WEB_USER="www-data"
    WEB_GROUP="www-data"
fi

chown -R $WEB_USER:$WEB_GROUP "$INSTALL_DIR"
chmod -R 775 "$INSTALL_DIR/storage" "$INSTALL_DIR/bootstrap/cache"

# 11. Nginx & Firewall Configuration
echo -e "${YELLOW}[11/12] Configuring Nginx & UFW...${NC}"
cat > /etc/nginx/sites-available/$PROJECT_NAME <<EOF
server {
    listen 80;
    server_name $APP_DOMAIN;
    root $INSTALL_DIR/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Firewall
if command -v ufw > /dev/null; then
    ufw allow 'Nginx Full'
    ufw --force enable
fi

systemctl restart nginx

# 12. Optional SSL (Let's Encrypt)
echo -e "${YELLOW}[11.1/12] SSL Configuration (Optional)...${NC}"
# Check if APP_DOMAIN is not an IP address
if [[ ! $APP_DOMAIN =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${CYAN}Detected domain ($APP_DOMAIN). Would you like to install Let's Encrypt SSL? (y/n)${NC}"
    # 10s timeout for interaction
    read -t 10 -p "Choice [n]: " ssl_choice
    ssl_choice=${ssl_choice:-n}

    if [[ $ssl_choice =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Please enter email for Let's Encrypt notifications:${NC}"
        read ssl_email
        if [ ! -z "$ssl_email" ]; then
            certbot --nginx -d "$APP_DOMAIN" --non-interactive --agree-tos -m "$ssl_email" --redirect
            echo -e "${GREEN}SSL successfully installed for $APP_DOMAIN${NC}"
            # Update APP_URL in .env
            sed -i "s|APP_URL=http://$APP_DOMAIN|APP_URL=https://$APP_DOMAIN|g" /var/www/pingpanther/.env
            APP_URL="https://$APP_DOMAIN"
        fi
    fi
else
    echo -e "${BLUE}IP address detected, skipping SSL configuration.${NC}"
fi

# 12. Setup Systemd Services (Queue & Schedule)
echo -e "${YELLOW}[12/12] Creating Systemd services...${NC}"

# Queue Worker (Horizon)
cat > /etc/systemd/system/pingpanther-horizon.service <<EOF
[Unit]
Description=PingPanther Horizon Queue Management
After=network.target postgresql.service redis-server.service

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php $INSTALL_DIR/artisan horizon
ExecStop=/usr/bin/php $INSTALL_DIR/artisan horizon:terminate
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=pingpanther-horizon

[Install]
WantedBy=multi-user.target
EOF

# Pulse/Checkers
echo "* * * * * www-data /usr/bin/php $INSTALL_DIR/artisan schedule:run >> /dev/null 2>&1" > /etc/cron.d/pingpanther-scheduler

systemctl daemon-reload
systemctl enable pingpanther-horizon
systemctl start pingpanther-horizon

# --- Finalize ---
echo -e "\n${GREEN}=================================================================${NC}"
echo -e "${GREEN}    INSTALLATION COMPLETE!${NC}"
echo -e "${GREEN}=================================================================${NC}"
echo -e "${CYAN}Access URL:  ${APP_URL:-http://$APP_DOMAIN}${NC}"
echo -e "${CYAN}DB User:     $DB_USER${NC}"
echo -e "${CYAN}DB Password: $DB_PASS${NC}"
echo -e "${CYAN}Project Dir: $INSTALL_DIR${NC}"
echo -e "${GREEN}=================================================================${NC}"
echo -e "${YELLOW}Demo Admin: admin@pingpanther.io / password${NC}"
echo -e "${GREEN}=================================================================${NC}"
