#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Moon Ideas — Redeploy script (run after first setup to push updates)
# On your VPS: bash /var/www/moonideas/deploy/redeploy.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

APP_DIR="/var/www/moonideas"

echo "==> Pulling latest code"
cd "$APP_DIR"
git pull

echo "==> Rebuilding frontend"
cd "$APP_DIR/frontend"
npm install --legacy-peer-deps
npm run build

echo "==> Updating backend dependencies"
cd "$APP_DIR/backend"
source venv/bin/activate
pip install -q -r requirements.txt
deactivate

echo "==> Restarting services"
pm2 restart moonideas-frontend moonideas-backend

echo ""
echo "✓ Redeployed. Check status with: pm2 status"
