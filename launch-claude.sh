#!/usr/bin/env bash
# launch-claude.sh — open Claude Code inside the Luminae workspace.
# Runs `claude --dangerously-skip-permissions` in this folder so the agent
# lands already pointed at the app code, assets and dev scripts.

set -uo pipefail
WS="$(cd "$(dirname "$0")" && pwd)"

# Open a fresh terminal sitting in the workspace, running Claude.
# `exec bash` keeps the terminal alive after you exit Claude.
if command -v konsole >/dev/null 2>&1; then
  konsole --separate \
    --workdir "$WS" \
    --title "Luminae · Claude" \
    -e bash -c "cd \"$WS\"; claude --dangerously-skip-permissions; exec bash" &
  disown
else
  # Fallback if Konsole isn't available.
  x-terminal-emulator -e bash -c "cd \"$WS\"; claude --dangerously-skip-permissions; exec bash" &
  disown
fi
