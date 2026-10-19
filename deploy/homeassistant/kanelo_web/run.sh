#!/bin/sh
# Serve /share/kanelo with nginx. With tunnel_token set, run a permanent Cloudflare tunnel
# for your own domain; otherwise optionally open a quick tunnel and write its URL to
# /share/kanelo-link.txt (shown in the add-on log as well).
LINK_FILE=/share/kanelo-link.txt
rm -f "$LINK_FILE"

nginx -g 'daemon off;' &

TOKEN=$(sed -n 's/.*"tunnel_token": *"\([^"]*\)".*/\1/p' /data/options.json 2>/dev/null)
if [ -n "$TOKEN" ]; then
  # permanent tunnel on your own domain (hostname is configured in Cloudflare Zero Trust)
  echo "Uruchamiam stały tunel Cloudflare (własna domena)."
  cloudflared tunnel --no-autoupdate run --token "$TOKEN" &
elif grep -q '"public_link": *true' /data/options.json 2>/dev/null; then
  cloudflared tunnel --no-autoupdate --url http://127.0.0.1:80 2>&1 | while read -r line; do
    url=$(echo "$line" | grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' | grep -v '^https://api\.')
    if [ -n "$url" ]; then
      echo "$url" > "$LINK_FILE"
      echo "=================================================="
      echo " PUBLICZNY LINK DO STRONY: $url"
      echo "=================================================="
    fi
  done &
fi

wait
