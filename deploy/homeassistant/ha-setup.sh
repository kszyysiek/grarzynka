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

echo "==> Dodatek KANELO Web (instalacja i start, za pierwszym razem kilka minut)"
SLUG=local_kanelo_web
ha store reload >/dev/null 2>&1 || ha addons reload >/dev/null 2>&1 || true
sleep 5
if ha addons info "$SLUG" --raw-json 2>/dev/null | grep -q '"version":"[0-9]'; then
  ha addons update "$SLUG" >/dev/null 2>&1 || ha addons rebuild "$SLUG" >/dev/null 2>&1 || true
else
  ha addons install "$SLUG"
fi
ha addons start "$SLUG" >/dev/null 2>&1 || ha addons restart "$SLUG" >/dev/null 2>&1 || true
sleep 3

echo
echo "==> Sprawdzenie"
[ -f "$WWW/index.html" ] && echo "OK   strona zbudowana ($(git rev-parse --short HEAD))" || echo "BŁĄD brak $WWW/index.html"
STATE=$(ha addons info "$SLUG" --raw-json 2>/dev/null | sed -n 's/.*"state":"\([a-z]*\)".*/\1/p')
echo "     dodatek KANELO Web: ${STATE:-nieznany}"
CODE=$(curl -s -o /dev/null -w '%{http_code}' http://local-kanelo-web/ || true)
[ "$CODE" = "200" ] && echo "OK   serwer strony odpowiada" || echo "BŁĄD serwer strony nie odpowiada (kod $CODE)"
if [ "$STATE" != "started" ]; then
  echo "--- ostatnie linie dziennika dodatku ---"
  ha addons logs "$SLUG" 2>/dev/null | tail -20 || true
fi

echo "     czekam na publiczny link (do 60 s)…"
for _ in $(seq 1 30); do [ -s /share/kanelo-link.txt ] && break; sleep 2; done

IP=$(ha network info --raw-json 2>/dev/null | sed -n 's/.*"address":\["\([0-9.]*\)\/.*/\1/p' | head -1 || true)
echo
echo "Strona: http://${IP:-homeassistant.local}:8080/"
if [ -s /share/kanelo-link.txt ]; then
  echo "Link publiczny (telefon, inni ludzie): $(cat /share/kanelo-link.txt)"
else
  echo "Link publiczny jeszcze się nie pojawił: Ustawienia → Dodatki → KANELO Web → Dziennik."
fi
