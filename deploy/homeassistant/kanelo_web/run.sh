#!/bin/sh
# Serve /share/kanelo with nginx; optionally open a public Cloudflare quick tunnel
# and write its URL to /share/kanelo-link.txt (shown in the add-on log as well).
LINK_FILE=/share/kanelo-link.txt
rm -f "$LINK_FILE"

nginx -g 'daemon off;' &

if grep -q '"public_link": *true' /data/options.json 2>/dev/null; then
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
