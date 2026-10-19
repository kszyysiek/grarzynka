#!/usr/bin/env bash
# Pull the latest site, build the static export and publish it to nginx.
# Usage on the Pi:  bash ~/kanelo/deploy/pi-update.sh
set -euo pipefail

SRC="${SRC:-$HOME/kanelo}"
BRANCH="${BRANCH:-$(git -C "$SRC" rev-parse --abbrev-ref HEAD)}"

cd "$SRC"
git pull --ff-only origin "$BRANCH"
npm ci --no-audit --no-fund
NODE_OPTIONS=--max-old-space-size=2048 npm run build
sudo rsync -a --delete out/ /var/www/kanelo/
sudo systemctl reload nginx
echo "Opublikowano $(git rev-parse --short HEAD)."
