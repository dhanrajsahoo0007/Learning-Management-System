#!/usr/bin/env bash
set -euo pipefail

SERVICES=(
  "gamification"
  "dsa"
  "system-design"
  "ai-system-design"
  "certifications"
  "webhooks"
  "gateway"
)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Deploying all LMS services to Fly.io ==="
echo ""

if ! command -v flyctl &> /dev/null; then
  echo "ERROR: flyctl is not installed."
  echo "Install it: curl -L https://fly.io/install.sh | sh"
  exit 1
fi

for svc in "${SERVICES[@]}"; do
  SVC_DIR="$BACKEND_DIR/services/$svc"

  if [ ! -f "$SVC_DIR/fly.toml" ]; then
    echo "SKIP: $svc (no fly.toml found)"
    continue
  fi

  echo "--- Deploying $svc ---"
  (cd "$SVC_DIR" && flyctl deploy --remote-only)
  echo "--- $svc deployed ---"
  echo ""
done

echo "=== All services deployed ==="
