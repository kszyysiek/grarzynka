#!/usr/bin/env bash
# KANELO on Home Assistant OS. Run in the "Terminal & SSH" add-on:
#   curl -fsSL https://raw.githubusercontent.com/kszyysiek/grarzynka/claude/intelligent-faraday-qyy48m/deploy/homeassistant/ha-setup.sh | bash
# Builds the static site into /share/kanelo and installs the local "KANELO Web" add-on
# that serves it on port 8080. Run it again to update the site.
set -euo pipefail

REPO="${REPO:-https://github.com/kszyysiek/grarzynka.git}"
BRANCH="${BRANCH:-claude/intelligent-faraday-qyy48m}"
SRC=/share/kanelo-src
WWW=/share/kanelo
ADDON=/addons/kanelo_web

echo "==> Narzędzia (node, git)"
apk add --no-cache nodejs npm git rsync >/dev/null

echo "==> Kod strony"
if [ -d "$SRC/.git" ]; then
  git -C "$SRC" fetch --depth 1 origin "$BRANCH"
  git -C "$SRC" reset --hard FETCH_HEAD
else
  git clone --depth 1 --branch "$BRANCH" "$REPO" "$SRC"
fi

echo "==> Budowanie (kilka minut)"
cd "$SRC"
npm ci --no-audit --no-fund
NODE_OPTIONS=--max-old-space-size=2048 npx next build

echo "==> Publikacja"
mkdir -p "$WWW"
rsync -a --delete out/ "$WWW/"

mkdir -p "$ADDON"
cp deploy/homeassistant/kanelo_web/* "$ADDON/"

IP=$(ha network info --raw-json 2>/dev/null | sed -n 's/.*"address":\["\([0-9.]*\)\/.*/\1/p' | head -1 || true)
echo
echo "Gotowe: strona zbudowana ($(git rev-parse --short HEAD))."
echo "Jeśli to pierwsza instalacja: Ustawienia → Dodatki → Sklep z dodatkami → ⋮ → Sprawdź aktualizacje"
echo "→ sekcja 'Local add-ons' → KANELO Web → Zainstaluj → Uruchom."
echo "Strona: http://${IP:-homeassistant.local}:8080/"
