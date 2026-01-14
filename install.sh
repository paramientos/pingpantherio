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
DB_PASS=$(openssl rand -hex 12)

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
echo -e "${BLUE}>>> Starting Installation for Ubuntu 22.04/24.04 <<<${NC}\n"

# --- Ubuntu Version Check ---
if [ -f /etc/os-release ]; then
    . /etc/os-release
    UBUNTU_VERSION=$VERSION_ID
    
    if [[ "$UBUNTU_VERSION" != "22.04" && "$UBUNTU_VERSION" != "24.04" ]]; then
        echo -e "${RED}Error: This script is designed for Ubuntu 22.04 or 24.04${NC}"
        echo -e "${RED}Your version: Ubuntu $UBUNTU_VERSION${NC}"
        echo -e "${YELLOW}Installation may not work correctly on this version.${NC}"
        read -p "Continue anyway? (yes/no) [default: yes]: " continue_version < /dev/tty
        continue_version=${continue_version:-yes}
        if [[ ! "$continue_version" =~ ^[Yy]([Ee][Ss])?$ ]]; then
            echo -e "${RED}Installation cancelled.${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✓ Ubuntu $UBUNTU_VERSION detected${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠ Could not detect Ubuntu version. Proceeding anyway...${NC}\n"
fi

# =================================================================
# INTERACTIVE SETUP - All questions asked upfront
# =================================================================

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}                  INSTALLATION CONFIGURATION${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# --- 1. Domain Setup & Admin Account ---
echo -e "${YELLOW}[1/3] Domain & Admin Configuration${NC}"
echo ""
read -p "Do you have a domain name for this installation? (yes/no) [default: no]: " has_domain < /dev/tty
has_domain=${has_domain:-no}

if [[ "$has_domain" =~ ^[Yy]([Ee][Ss])?$ ]]; then
    echo ""
    echo -e "${RED}⚠️  IMPORTANT: DNS A Record Configuration Required${NC}"
    echo -e "${YELLOW}Before proceeding, you MUST ensure that:${NC}"
    echo -e "  1. Your domain's A record is pointing to this server's IP address"
    echo -e "  2. DNS propagation is complete (this may take a few minutes)"
    echo -e "  3. The DNS records are properly configured at your domain registrar"
    echo ""
    SERVER_IP=$(hostname -I | awk '{print $1}')
    echo -e "${CYAN}This server's IP address: ${GREEN}$SERVER_IP${NC}"
    echo ""
    
    read -p "Enter your domain name (e.g., status.example.com): " APP_DOMAIN < /dev/tty
    
    # Verify DNS A record matches server IP
    echo -e "${YELLOW}Checking DNS configuration...${NC}"
    RESOLVED_IP=$(dig +short "$APP_DOMAIN" @8.8.8.8 | tail -n1)
    
    if [ -z "$RESOLVED_IP" ]; then
        echo -e "${RED}⚠️  WARNING: Could not resolve domain $APP_DOMAIN${NC}"
        echo -e "${YELLOW}The domain may not have DNS records configured yet.${NC}"
        read -p "Continue anyway? (yes/no) [default: yes]: " continue_anyway < /dev/tty
        continue_anyway=${continue_anyway:-yes}
        if [[ ! "$continue_anyway" =~ ^[Yy]([Ee][Ss])?$ ]]; then
            echo -e "${RED}Installation cancelled. Please configure DNS and try again.${NC}"
            exit 1
        fi
    elif [ "$RESOLVED_IP" != "$SERVER_IP" ]; then
        echo -e "${RED}⚠️  DNS MISMATCH DETECTED!${NC}"
        echo -e "  Domain resolves to: ${RED}$RESOLVED_IP${NC}"
        echo -e "  Server IP is:       ${GREEN}$SERVER_IP${NC}"
        echo -e "${YELLOW}The A record is not pointing to this server!${NC}"
        read -p "Continue anyway? (yes/no) [default: yes]: " continue_anyway < /dev/tty
        continue_anyway=${continue_anyway:-yes}
        if [[ ! "$continue_anyway" =~ ^[Yy]([Ee][Ss])?$ ]]; then
            echo -e "${RED}Installation cancelled. Please update DNS records and try again.${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✓ DNS verification successful! Domain resolves to $RESOLVED_IP${NC}"
    fi
    
    echo -e "${GREEN}✓ Using domain: $APP_DOMAIN${NC}"
    HAS_DOMAIN=true
else
    APP_DOMAIN=$(hostname -I | awk '{print $1}')
    echo -e "${BLUE}ℹ No domain provided. Using server IP: $APP_DOMAIN${NC}"
    echo -e "${YELLOW}⚠ SSL certificates will not be installed without a domain.${NC}"
    HAS_DOMAIN=false
fi

echo ""

read -p "Enter admin email address for panel login: " ADMIN_EMAIL < /dev/tty
echo -e "${GREEN}✓ Admin account will be created${NC}"

echo ""

# --- 2. SSL Configuration ---
INSTALL_SSL=false
SSL_EMAIL=""

if [[ "$HAS_DOMAIN" == "true" ]]; then
    echo -e "${YELLOW}[2/3] SSL Certificate Configuration${NC}"
    echo -e "${CYAN}Would you like to install Let's Encrypt SSL certificate? (yes/no) [default: yes]${NC}"
    read -p "Choice: " ssl_choice < /dev/tty
    ssl_choice=${ssl_choice:-yes}
    
    if [[ $ssl_choice =~ ^[Yy]([Ee][Ss])?$ ]]; then
        echo ""
        echo -e "${YELLOW}⚠️  IMPORTANT: CloudFlare Users${NC}"
        echo -e "${RED}If you are using CloudFlare, you MUST disable SSL/TLS Proxy (set to DNS Only)${NC}"
        echo -e "${YELLOW}Reason: We provide SSL certificates via Let's Encrypt directly on this server.${NC}"
        echo -e "${YELLOW}CloudFlare's proxy mode will conflict with our SSL configuration.${NC}"
        echo ""
        echo -e "${CYAN}Steps for CloudFlare users:${NC}"
        echo -e "  1. Go to CloudFlare DNS settings"
        echo -e "  2. Find your A record for $APP_DOMAIN"
        echo -e "  3. Click the orange cloud icon to turn it gray (DNS Only)"
        echo -e "  4. Wait a few minutes for changes to propagate"
        echo ""
        
        read -p "Enter email for Let's Encrypt notifications [default: $ADMIN_EMAIL]: " SSL_EMAIL < /dev/tty
        SSL_EMAIL=${SSL_EMAIL:-$ADMIN_EMAIL}
        if [ ! -z "$SSL_EMAIL" ]; then
            INSTALL_SSL=true
            echo -e "${GREEN}✓ SSL will be installed for $APP_DOMAIN${NC}"
        else
            echo -e "${YELLOW}⚠ No email provided, skipping SSL installation${NC}"
        fi
    else
        echo -e "${BLUE}ℹ Skipping SSL installation${NC}"
    fi
    echo ""
else
    echo -e "${YELLOW}[2/3] SSL Certificate Configuration${NC}"
    echo -e "${BLUE}ℹ Skipping SSL (no domain configured)${NC}"
    echo ""
fi


ADMIN_PASSWORD=$(openssl rand -base64 16)
echo -e "${GREEN}✓ Admin account will be created${NC}"

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}                  INSTALLATION SUMMARY${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Domain/IP:    ${GREEN}$APP_DOMAIN${NC}"
echo -e "  Install Path: ${GREEN}$INSTALL_DIR${NC}"
echo -e "  SSL:          ${GREEN}$([ "$INSTALL_SSL" == "true" ] && echo "Yes ($SSL_EMAIL)" || echo "No")${NC}"
echo -e "  Admin Email:  ${GREEN}$ADMIN_EMAIL${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
read -p "Press Enter to start installation or Ctrl+C to cancel..." < /dev/tty
echo ""

echo -e "${GREEN}Starting unattended installation...${NC}\n"

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

# Configure PostgreSQL authentication for password-based connections
echo -e "${YELLOW}Configuring PostgreSQL authentication...${NC}"
PG_HBA=$(find /etc/postgresql -name pg_hba.conf | head -n 1)
if [ -f "$PG_HBA" ]; then
    cp "$PG_HBA" "${PG_HBA}.backup"
    # Remove existing 127.0.0.1 rules and add md5 auth
    sed -i '/^host.*all.*all.*127.0.0.1\/32/d' "$PG_HBA"
    echo "host    all             all             127.0.0.1/32            md5" >> "$PG_HBA"
    systemctl reload postgresql
fi

# 5. Configure PostgreSQL
echo -e "${YELLOW}[5/12] Configuring Database...${NC}"
# Check if user exists
USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")
if [ "$USER_EXISTS" != "1" ]; then
    echo -e "${YELLOW}Creating database user '$DB_USER'...${NC}"
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
fi

# Check if database exists
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
if [ "$DB_EXISTS" != "1" ]; then
    echo -e "${YELLOW}Creating database '$DB_NAME'...${NC}"
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
else
    echo -e "${BLUE}Database already exists.${NC}"
fi

# Grant comprehensive permissions on public schema
echo -e "${YELLOW}Granting schema permissions...${NC}"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "GRANT CREATE ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "ALTER SCHEMA public OWNER TO $DB_USER;"

# Always update password (critical for reinstalls with new .env)
echo -e "${YELLOW}Syncing database password...${NC}"
sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';"

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

if [ -f ".env" ]; then
    BACKUP_ENV=".env.backup_$(date +%s)"
    echo -e "${YELLOW}Existing .env detected. Backing up to $BACKUP_ENV...${NC}"
    mv .env "$BACKUP_ENV"
fi

# Create new .env from example
cp .env.example .env
    sed -i "s|^APP_NAME=.*|APP_NAME=PingPanther|g" .env
    sed -i "s|^APP_ENV=.*|APP_ENV=production|g" .env
    sed -i "s|^APP_DEBUG=.*|APP_DEBUG=false|g" .env
    sed -i "s|^APP_URL=.*|APP_URL=http://$APP_DOMAIN|g" .env
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=pgsql|g" .env
    sed -i "s|^#* *DB_HOST=.*|DB_HOST=127.0.0.1|g" .env
    sed -i "s|^#* *DB_PORT=.*|DB_PORT=5432|g" .env
    sed -i "s|^#* *DB_DATABASE=.*|DB_DATABASE=$DB_NAME|g" .env
    sed -i "s|^#* *DB_USERNAME=.*|DB_USERNAME=$DB_USER|g" .env
    sed -i "s|^#* *DB_PASSWORD=.*|DB_PASSWORD=$DB_PASS|g" .env
    sed -i "s|^CACHE_STORE=.*|CACHE_STORE=redis|g" .env
    sed -i "s|^QUEUE_CONNECTION=.*|QUEUE_CONNECTION=redis|g" .env
    # Key generation moved to after composer install
    # else block removed as we always recreate .env

# 9. Install Dependencies
echo -e "${YELLOW}[9/12] Installing PHP & Frontend dependencies...${NC}"
composer install --no-dev --optimize-autoloader --no-interaction
composer dump-autoload --no-interaction
yarn install

# Remove demo credentials from Login page for production
echo -e "${YELLOW}Removing demo credentials from login page...${NC}"

LOGIN_FILE="$INSTALL_DIR/resources/js/Pages/Auth/Login.jsx"
if [ -f "$LOGIN_FILE" ]; then
    # Use sed to replace the specific strings safely
    sed -i "s/email: 'admin@pingpanther.io'/email: ''/g" "$LOGIN_FILE"
    sed -i "s/password: 'password'/password: ''/g" "$LOGIN_FILE"

    # Remove the Demo Access UI block (Divider and the following Paper)
    sed -i '/<Divider label="Demo Access"/,/<\/Paper>/d' "$LOGIN_FILE"
    
    echo -e "${GREEN}✓ Demo credentials removed from login page${NC}"
else
    echo -e "${YELLOW}⚠ Login file not found, skipping demo removal${NC}"
fi

# Remove Umami Analytics script for production
echo -e "${YELLOW}Removing analytics script for production...${NC}"

APP_BLADE="$INSTALL_DIR/resources/views/app.blade.php"
if [ -f "$APP_BLADE" ]; then
    # Remove Umami Analytics comment and script tag
    sed -i '/<!-- Umami Analytics -->/,/<\/script>/d' "$APP_BLADE"
    
    echo -e "${GREEN}✓ Analytics script removed${NC}"
else
    echo -e "${YELLOW}⚠ app.blade.php not found, skipping analytics removal${NC}"
fi

yarn build

# Generate Application Key (now that composer install is done)
if [ ! -f ".env" ] || ! grep -q "^APP_KEY=base64:" .env; then
    echo -e "${YELLOW}Generating Application Key...${NC}"
    php artisan key:generate --force
fi

# 10. Database Migrations & Admin User Creation
echo -e "${YELLOW}[10/12] Initializing Database & Creating Admin User...${NC}"
php artisan migrate --force

# Create admin user (credentials collected at start)
php artisan pp:create-admin "$ADMIN_EMAIL" "$ADMIN_PASSWORD"

php artisan horizon:install



# Clear any existing cache before optimization
echo -e "${YELLOW}Clearing existing cache...${NC}"
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

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
    ufw allow ssh
    ufw allow http
    ufw allow https
    ufw --force enable
fi

systemctl restart nginx

# 12. Optional SSL (Let's Encrypt)
echo -e "${YELLOW}[11.1/12] SSL Configuration...${NC}"
if [[ "$INSTALL_SSL" == "true" ]]; then
    echo -e "${YELLOW}Installing SSL certificate for $APP_DOMAIN...${NC}"
    certbot --nginx -d "$APP_DOMAIN" --non-interactive --agree-tos -m "$SSL_EMAIL" --redirect
    echo -e "${GREEN}✓ SSL successfully installed for $APP_DOMAIN${NC}"
    
    # Update APP_URL in .env
    sed -i "s|APP_URL=http://$APP_DOMAIN|APP_URL=https://$APP_DOMAIN|g" $INSTALL_DIR/.env
    APP_URL="https://$APP_DOMAIN"
    
    # Clear and rebuild cache after SSL configuration
    echo -e "${YELLOW}Rebuilding cache after SSL installation...${NC}"
    cd $INSTALL_DIR
    php artisan config:clear
    php artisan cache:clear
    php artisan config:cache
    echo -e "${GREEN}✓ Cache rebuilt with HTTPS configuration${NC}"
else
    echo -e "${BLUE}ℹ Skipping SSL installation${NC}"
    APP_URL="http://$APP_DOMAIN"
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

echo -e "${GREEN}✓ Admin account created!${NC}"
echo -e "${YELLOW}⚠ Save these credentials:${NC}"
echo -e "  Email: ${GREEN}$ADMIN_EMAIL${NC}"
echo -e "  Password: ${GREEN}$ADMIN_PASSWORD${NC}"

echo ""
echo -e "${CYAN}💡 Forgot your password?${NC}"
echo -e "  Run: ${YELLOW}php artisan pp:reset-password${NC}"
echo ""

echo -e "${GREEN}=================================================================${NC}"
echo -e "Please give us a star on GitHub if you find PingPanther useful!"
echo -e "https://github.com/paramientos/pingpantherio"
echo -e "${GREEN}=================================================================${NC}"