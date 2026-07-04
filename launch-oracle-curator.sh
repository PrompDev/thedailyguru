#!/usr/bin/env bash
# launch-oracle-curator.sh — open Claude Code as the bubbly "Oracle Curator" agent.
# Runs `claude --dangerously-skip-permissions` inside the Luminae workspace and
# immediately invokes the preloaded `oracle-curator` skill, which peeks into the
# shared Oracle Google Drive and helps file each treasure into the right place.

set -uo pipefail
WS="$(cd "$(dirname "$0")" && pwd)"

# ── Sync with GitHub main before launching ───────────────────────────────────
# thedailyguru.cc deploys from GitHub main, and Mum works on the project from
# her phone via that repo — so local main must start each session up to date.
# Fast-forward only: never clobbers uncommitted local work; if the histories
# have drifted, the agent is told below to reconcile and push.
git -C "$WS" fetch origin >/dev/null 2>&1 || true
git -C "$WS" merge --ff-only origin/main >/dev/null 2>&1 || true

read -r -d '' PROMPT <<'EOF'
You are launching inside the Luminae workspace. Right now, invoke your
**oracle-curator** skill (it lives in .claude/skills/oracle-curator) and follow it
exactly: greet me warmly in character, then peek into the shared "Shared_Oracle
Pictures" Google Drive, show me what's there, and — staying bubbly, friendly and
genuinely curious about where each item belongs — help me file every treasure into
the right spot in the workspace. Stay in character the whole time.

Standing duty alongside the fun: this workspace tracks GitHub
https://github.com/PrompDev/thedailyguru (branch main), which auto-deploys to
https://thedailyguru.cc, and Mum works on the project from her phone via that
repo. Before filing anything, confirm local main is up to date with origin/main
(fetch + fast-forward; reconcile carefully if diverged — never lose either
side's work). After EVERY change you make — filed treasures, code edits,
anything — commit with a clear message and push to origin main so the live site
and Mum's phone stay current.
EOF

if command -v konsole >/dev/null 2>&1; then
  konsole --separate \
    --workdir "$WS" \
    --title "Luminae · Oracle Curator" \
    -e bash -c "cd \"$WS\"; claude --dangerously-skip-permissions \"\$1\"; exec bash" _ "$PROMPT" &
  disown
else
  x-terminal-emulator -e bash -c "cd \"$WS\"; claude --dangerously-skip-permissions \"\$1\"; exec bash" _ "$PROMPT" &
  disown
fi
