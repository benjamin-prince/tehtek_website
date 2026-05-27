#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

SSH_KEY="$HOME/LightsailDefaultKey-eu-west-3.pem"
VPS="ubuntu@tehtek.com"
REMOTE_DIR="/opt/tehtek-shop"
IMAGE="tehtek-shop:local"
CONTAINER="tehtek_shop"
NETWORK="backend_internal"
API_URL="https://api2.tehtek.com/api/v1"

echo "==> Syncing source to VPS..."
rsync -az --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  -e "ssh -i $SSH_KEY" \
  . "$VPS:$REMOTE_DIR/"

echo "==> Building on VPS..."
ssh -i "$SSH_KEY" "$VPS" "
  cd $REMOTE_DIR
  docker build \
    --build-arg NEXT_PUBLIC_API_URL=$API_URL \
    -t $IMAGE .
  docker stop $CONTAINER 2>/dev/null || true
  docker rm   $CONTAINER 2>/dev/null || true
  docker run -d \
    --name $CONTAINER \
    --network $NETWORK \
    --network-alias tehtek-shop \
    --restart unless-stopped \
    -e HOSTNAME=0.0.0.0 \
    -e NODE_ENV=production \
    -e NEXT_TELEMETRY_DISABLED=1 \
    -e PORT=3000 \
    $IMAGE
  sleep 2
  docker logs $CONTAINER --tail 4
"

echo "==> Done. Shop running at tehtek.com"
