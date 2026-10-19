FROM nginx:1.27-alpine

# cloudflared gives the site a free public https://….trycloudflare.com link
ARG CLOUDFLARED_VERSION=2024.8.2
RUN apk add --no-cache curl \
 && case "$(uname -m)" in \
      aarch64) a=arm64 ;; armv7l|armv6l) a=arm ;; *) a=amd64 ;; \
    esac \
 && curl -fsSL -o /usr/local/bin/cloudflared "https://github.com/cloudflare/cloudflared/releases/download/${CLOUDFLARED_VERSION}/cloudflared-linux-${a}" \
 && chmod +x /usr/local/bin/cloudflared

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY run.sh /run.sh
RUN chmod +x /run.sh
ENTRYPOINT ["/run.sh"]
