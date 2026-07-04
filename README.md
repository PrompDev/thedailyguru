# Luminae — local dev workspace

A local copy of the **Luminae** sanctuary app (React), cloned from the
"Shared_Oracle Pictures" Google Drive folder so it can be run and tested
on this laptop.

## Run it

Double-click **Luminae · Start Server** on the Desktop, or:

```bash
./start-server.sh
```

This installs dependencies on first run, starts the Vite dev server, and
opens http://localhost:5173/ once it's actually responding. It's also
reachable from a phone on the same Wi-Fi at the `Network:` URL printed
in the terminal.

## Work on it with Claude

Double-click **Luminae · Claude** on the Desktop, or:

```bash
./launch-claude.sh
```

Opens Claude Code (`claude --dangerously-skip-permissions`) in a terminal
already sitting in this folder.

## Layout

```
luminae/
├── index.html            # Vite entry
├── src/
│   ├── main.jsx          # mounts <Luminae/>
│   └── Luminae.jsx       # the app (raw, from Drive: luminae.jsx)
├── public/
│   ├── audio/            # the .mp3 tracks from Drive
│   └── images/           # the .png screenshots from Drive
├── assets/               # originals: luminae.jsx + luminae-1.jsx.txt
├── icons/lobster.svg     # desktop launcher icon 🦞
├── start-server.sh
└── launch-claude.sh
```

## Notes
- The app's ambient sound is generated procedurally (Web Audio); the .mp3s
  and screenshots are reference assets, not yet wired into the code.
- `Golden Glow- Angels blessing (1).mp3` came down empty (all zero bytes) —
  the file is corrupt/empty on Google Drive itself, so it was kept but is
  not playable. Re-export it from the source if you need that track.
