#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Moon Ideas — One-time VPS setup script
# Tested on Ubuntu 24.04 LTS
#
# Usage (run as root on the VPS):
#   bash /var/www/moonideas/deploy/setup.sh 2.25.97.128
# ─────────────────────────────────────────────────────────────────────────────
set -e

SERVER_IP="${1:?Usage: bash setup.sh YOUR_SERVER_IP}"

echo "==> [1/8] Updating system packages"
apt-get update -qq && apt-get upgrade -y -qq

echo "==> [2/8] Installing dependencies"
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
# Ubuntu 24.04 ships Python 3.12; python3-venv covers it
apt-get install -y nodejs nginx postgresql postgresql-contrib \
  python3 python3-venv python3-pip git curl

# PM2 globally
npm install -g pm2

echo "==> [3/8] Setting up PostgreSQL"
systemctl start postgresql
systemctl enable postgresql
sudo -u postgres psql -c "CREATE USER appuser WITH PASSWORD 'apppassword';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE technician_ideas OWNER appuser;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE technician_ideas TO appuser;" 2>/dev/null || true

echo "==> [4/8] Setting up backend"
cd /var/www/moonideas/backend

python3 -m venv venv
source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Write production .env (generates a fresh SECRET_KEY every first run)
if [ ! -f .env ]; then
  cat > .env <<EOF
DATABASE_URL=postgresql+asyncpg://appuser:apppassword@localhost:5432/technician_ideas
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ADMIN_EMAIL=Cammy@moonideas.com
ADMIN_PASSWORD=ChangeMe123!
EMAILS_ENABLED=false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EOF
  echo "    Created backend/.env with fresh SECRET_KEY"
else
  echo "    backend/.env already exists — skipping (keeping existing SECRET_KEY)"
fi

deactivate

echo "==> [5/8] Building frontend"
cd /var/www/moonideas/frontend

cat > .env.production.local <<EOF
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_NAME=Moon Ideas
NEXT_PUBLIC_SITE_URL=http://${SERVER_IP}
EOF

npm install --legacy-peer-deps
npm run build

echo "==> [6/8] Configuring PM2"
cd /var/www/moonideas

cat > ecosystem.config.js <<'PMEOF'
module.exports = {
  apps: [
    {
      name: "moonideas-frontend",
      cwd: "/var/www/moonideas/frontend",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      max_memory_restart: "400M",
      restart_delay: 3000,
    },
    {
      name: "moonideas-backend",
      cwd: "/var/www/moonideas/backend",
      script: "/var/www/moonideas/backend/venv/bin/gunicorn",
      args: "app.main:app -k uvicorn.workers.UvicornWorker --workers 2 --bind 127.0.0.1:8000 --access-logfile - --error-logfile -",
      interpreter: "none",
      env: {
        PYTHONPATH: "/var/www/moonideas/backend",
      },
      max_memory_restart: "300M",
      restart_delay: 3000,
    },
  ],
};
PMEOF

# Stop existing PM2 processes if running, then start fresh
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Register PM2 to start on reboot
env PATH="$PATH:/usr/bin" pm2 startup systemd -u root --hp /root
systemctl enable pm2-root

echo "==> [7/8] Configuring Nginx"
cat > /etc/nginx/sites-available/moonideas <<NGEOF
server {
    listen 80;
    server_name ${SERVER_IP};

    # Increase buffer sizes for Next.js responses
    proxy_buffer_size          128k;
    proxy_buffers              4 256k;
    proxy_busy_buffers_size    256k;

    # Serve Next.js frontend
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }

    # Proxy /api/* → FastAPI on port 8000 (strips the /api prefix)
    location /api/ {
        rewrite            ^/api/(.*)\$ /\$1 break;
        proxy_pass         http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   Authorization \$http_authorization;
        proxy_pass_header  Authorization;
        proxy_read_timeout 30s;
    }
}
NGEOF

ln -sf /etc/nginx/sites-available/moonideas /etc/nginx/sites-enabled/moonideas
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl restart nginx

echo "==> [8/8] Opening firewall ports"
# Allow HTTP, HTTPS, and SSH
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "════════════════════════════════════════════"
echo "  ✓ Deployment complete!"
echo ""
echo "  Site:         http://${SERVER_IP}"
echo "  Admin panel:  http://${SERVER_IP}/admin"
echo "  API health:   http://${SERVER_IP}/api/health"
echo ""
echo "  pm2 status    — check both processes"
echo "  pm2 logs      — live log stream"
echo "════════════════════════════════════════════"
