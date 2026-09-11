# Electron Desktop Build

Live API Inspector ships as a Windows desktop app via Electron.

## How it works

```text
Electron Main Process (main.js)
        │
        ├── spawns  backend/dist/main.js       → :4000  (NestJS)
        ├── spawns  next start                 → :3000  (Next.js)
        │
        └── BrowserWindow loads http://localhost:3000
```

Both backend and frontend run as **child processes** of the Electron app. When
the window closes, both are killed.

## Folder layout

```
electron/
├── main.js                 # Electron entry point
├── preload.js              # Renderer preload
├── package.json            # Electron app manifest
├── electron-builder.yml    # Packaging config
└── dist/                   # Build output (gitignored)
```

## Development

Run the desktop app against your local dev servers:

```
# terminal 1
cd backend
npm run start:dev

# terminal 2
cd frontend
npm run dev

# terminal 3
cd electron
npm install
npm start
```

Electron loads `http://localhost:3000`.

## Production EXE build

```
cd scripts
.\build-exe.ps1
```

This:

1. Builds the backend (`backend/dist/`)
2. Builds the frontend (`frontend/.next/`)
3. Installs Electron tooling
4. Runs `electron-builder --win`
5. Emits files into `electron/dist/`

Expected output:

- `Live-API-Inspector-Setup.exe` — NSIS installer
- `Live-API-Inspector-Portable.exe` — portable build

## What's bundled

`electron-builder.yml` copies the following into `resources/`:

- `backend/dist`
- `backend/node_modules` (production)
- `backend/package.json`
- `frontend/.next`
- `frontend/public`
- `frontend/node_modules` (production)
- `frontend/package.json`
- `frontend/next.config.ts`

At runtime, `main.js` reads `process.resourcesPath` to locate them.

## Ports

Fixed for V1:

- Backend: `4000`
- Frontend: `3000`

If either is occupied, the app will show an error dialog on startup.

## Icon

Place your icons in `electron/build/`:

- `build/icon.ico` — Windows
- `build/icon.png` — Linux
- `build/icon.icns` — macOS

If missing, electron-builder uses its default icon.

## Troubleshooting

| Symptom ↕▾ | Cause / Fix ↕▾ |
|---|---|
| −Blank window | Backend or frontend failed to start — check console |
| −"Timed out waiting for URL" | Port 3000 blocked, or Next.js build missing |
| −EXE exits immediately | Run from PowerShell to see stderr |
| −Antivirus flags the EXE | Unsigned binary — allowlist or sign in production |
| −Large installer (>200 MB) | `node_modules` fully bundled — trim via `.npmignore` |
⚙

