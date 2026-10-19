#!/usr/bin/env bash
# One-time setup of a Raspberry Pi (Raspberry Pi OS 64-bit, Pi 4/5) as the KANELO web server.
# Usage on the Pi:  bash pi-setup.sh
# Installs Node 20, nginx and cloudflared, clones the site, builds it and serves it on port 80.
set -euo pipefail

REPO="${REPO:-https://github.com/kszyysiek/grarzynka.git}"
BRANCH="${BRANCH:-claude/intelligent-faraday-qyy48m}"
SRC="${SRC:-$HOME/kanelo}"

echo "==> System packages"
sudo apt-get update
sudo apt-get install -y git nginx curl rsync ca-certificates

echo "==> Node.js 20"
if ! node -v 2>/dev/null | grep -q '^v20'; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "==> cloudflared"
if ! command -v cloudflared >/dev/null; then
  sudo mkdir -p --mode=0755 /usr/share/keyrings
  curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
  echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" \
    | sudo tee /etc/apt/sources.list.d/cloudflared.list
  sudo apt-get update && sudo apt-get install -y cloudflared
fi

echo "==> Swap (the build needs ~2 GB memory)"
if [ "$(free -m | awk '/Mem:/ {print $2}')" -lt 3500 ] && [ -f /etc/dphys-swapfile ]; then
  sudo sed -i 's/^CONF_SWAPSIZE=.*/CONF_SWAPSIZE=2048/' /etc/dphys-swapfile
  sudo systemctl restart dphys-swapfile
fi

echo "==> Source code"
if [ -d "$SRC/.git" ]; then
  git -C "$SRC" fetch origin "$BRANCH" && git -C "$SRC" checkout "$BRANCH" && git -C "$SRC" pull --ff-only origin "$BRANCH"
else
  git clone --branch "$BRANCH" "$REPO" "$SRC"
fi

echo "==> nginx"
sudo mkdir -p /var/www/kanelo
sudo cp "$SRC/deploy/nginx-kanelo.conf" /etc/nginx/sites-available/kanelo
sudo ln -sf /etc/nginx/sites-available/kanelo /etc/nginx/sites-enabled/kanelo
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable --now nginx

bash "$SRC/deploy/pi-update.sh"

echo
echo "Gotowe. Strona działa w sieci domowej: http://$(hostname -I | awk '{print $1}')/"
echo "Dalej: publiczny adres przez Cloudflare Tunnel, patrz deploy/README.md (krok 3)."
