#!/usr/bin/env bash
# start-server.sh — boot the Luminae local dev server and open it in a browser
# once it's actually responding. Safe to run repeatedly.

set -uo pipefail
WS="$(cd "$(dirname "$0")" && pwd)"
cd "$WS"

PORT=5173
URL="http://localhost:${PORT}"
LOG=/tmp/luminae-dev.log

echo "[luminae] workspace: $WS"

# 1. Free the port if a stale server is holding it.
fuser -k -n tcp "$PORT" 2>/dev/null && sleep 0.4

# 2. Install dependencies on first run (or if node_modules is missing).
if [ ! -d node_modules ]; then
  echo "[luminae] first run — installing dependencies (npm install)…"
  npm install || { echo "[luminae] npm install FAILED — see above"; exit 1; }
fi

# 3. Start Vite in the background, logging to $LOG.
echo "[luminae] starting dev server…"
setsid npm run dev >"$LOG" 2>&1 < /dev/null &
disown

# 4. Wait until the server actually answers before opening the browser.
echo "[luminae] waiting for $URL …"
for i in $(seq 1 40); do
  if curl -sf -o /dev/null "$URL"; then
    echo "[luminae] server is up (after ${i}s) — opening browser"
    xdg-open "$URL" >/dev/null 2>&1 &
    disown
    echo "[luminae] done. Dev log: $LOG  (Ctrl+C here is not needed; server runs detached)"
    exit 0
  fi
  sleep 1
done

echo "[luminae] server did not respond within 40s — check the log: $LOG"
tail -n 30 "$LOG" 2>/dev/null
exit 1
