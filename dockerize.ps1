# PingPanther Docker Setup for Windows
$ErrorActionPreference = "Stop"

# Colors are handled by Write-Host -ForegroundColor
Write-Host "🐾 PingPanther Docker Setup" -ForegroundColor Green
Write-Host "================================"

$EnvFile = ".env"
$ExampleFile = ".env.example"

function Get-RandomHex {
    param([int]$length = 32)
    $bytes = New-Object Byte[] $length
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    return [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()
}

function Get-AppKey {
    $bytes = New-Object Byte[] 32
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    return "base64:" + [Convert]::ToBase64String($bytes)
}

function Ensure-EnvVar {
    param (
        [string]$VarName,
        [string]$DefaultValue
    )

    if (Test-Path ".env") {
        $lines = Get-Content ".env"
        $found = $false
        $updatedLines = New-Object System.Collections.Generic.List[string]
        
        foreach ($line in $lines) {
            if ($line -match "^${VarName}=(.*)") {
                $found = $true
                $value = $matches[1]
                if ([string]::IsNullOrWhiteSpace($value)) {
                    Write-Host "🔧 Set ${VarName}=${DefaultValue}" -ForegroundColor Yellow
                    $updatedLines.Add("${VarName}=${DefaultValue}")
                } else {
                    $updatedLines.Add($line)
                }
            } else {
                $updatedLines.Add($line)
            }
        }

        if (-not $found) {
            Write-Host "🔧 Set ${VarName}=${DefaultValue}" -ForegroundColor Yellow
            $updatedLines.Add("${VarName}=${DefaultValue}")
        }
        $updatedLines | Set-Content ".env"
    }
}

# Check if .env exists, create from example if not
if (-not (Test-Path $EnvFile)) {
    Write-Host "📄 .env file not found, creating from .env.example..." -ForegroundColor Yellow
    Copy-Item $ExampleFile $EnvFile

    # Generate secure values
    $DB_PASSWORD = Get-RandomHex 32
    $REDIS_PASSWORD = Get-RandomHex 32
    $APP_KEY = Get-AppKey

    # Update .env with generated values
    Ensure-EnvVar "DB_PASSWORD" $DB_PASSWORD
    Ensure-EnvVar "REDIS_PASSWORD" $REDIS_PASSWORD
    Ensure-EnvVar "APP_KEY" $APP_KEY

    Write-Host "✅ Generated secure passwords and APP_KEY" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green

    # Check and generate if missing
    $lines = Get-Content $EnvFile
    if (-not ($lines -match "^DB_PASSWORD=.+") -or ($lines -match "^DB_PASSWORD=\s*$")) {
        Ensure-EnvVar "DB_PASSWORD" (Get-RandomHex 32)
        Write-Host "🔑 Generated DB_PASSWORD" -ForegroundColor Yellow
    }
    if (-not ($lines -match "^REDIS_PASSWORD=.+") -or ($lines -match "^REDIS_PASSWORD=\s*$")) {
        Ensure-EnvVar "REDIS_PASSWORD" (Get-RandomHex 32)
        Write-Host "🔑 Generated REDIS_PASSWORD" -ForegroundColor Yellow
    }
    if (-not ($lines -match "^APP_KEY=.+") -or ($lines -match "^APP_KEY=\s*$")) {
        Ensure-EnvVar "APP_KEY" (Get-AppKey)
        Write-Host "🔑 Generated APP_KEY" -ForegroundColor Yellow
    }
}

# Set default values for Docker environment
Ensure-EnvVar "APP_ENV" "local"
Ensure-EnvVar "APP_DEBUG" "true"
Ensure-EnvVar "APP_PORT" "8080"
Ensure-EnvVar "APP_URL" "http://localhost:8080"
Ensure-EnvVar "DB_CONNECTION" "pgsql"
Ensure-EnvVar "DB_HOST" "pingpanther-postgres"
Ensure-EnvVar "DB_PORT" "5432"
Ensure-EnvVar "DB_DATABASE" "pingpanther"
Ensure-EnvVar "DB_USERNAME" "postgres"
Ensure-EnvVar "REDIS_HOST" "pingpanther-redis"
Ensure-EnvVar "REDIS_PORT" "6379"

# Ensure required directories exist
if (-not (Test-Path "docker")) {
    New-Item -ItemType Directory -Path "docker" | Out-Null
}

if (-not (Test-Path "docker/entrypoint.sh")) {
    Write-Host "❌ docker/entrypoint.sh not found!" -ForegroundColor Red
    exit 1
}

# Check if Docker is running
docker info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Stop and remove existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker compose down -v 2>$null

# Build and start containers
Write-Host "🏗️  Building and starting containers..." -ForegroundColor Yellow
docker compose build --no-cache
docker compose up -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check status
Write-Host ""
Write-Host "📊 Container Status:" -ForegroundColor Green
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | Select-String "pingpanther"

Write-Host ""
Write-Host "✅ PingPanther is starting up!" -ForegroundColor Green
Write-Host "📱 App URL: http://localhost:8080"
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs:     docker compose logs -f app"
Write-Host "  Stop:          docker compose down"
Write-Host "  Restart:       docker compose restart"
Write-Host "  Shell access:  docker compose exec app bash"
