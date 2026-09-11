<h1 align="center">Live API Inspector</h1>

<!-- Replace programmingpioneer with your GitHub username before pushing -->

<p align="center"><em>Real-time webhook and HTTP request inspector â€” capture, view, and replay incoming API requests live in the browser.</em></p>

<p align="center"><strong>ðŸš€ Current Release: V1.0.0 â€” Live Edition | 2026</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/version-V1.0.0-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/release-2026-success?style=flat-square" alt="Release">
  <img src="https://img.shields.io/badge/status-Stable-success?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/NestJS-12-E0234E?style=flat-square&logo=nestjs" alt="NestJS">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socket.io" alt="Socket.IO">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/License-TBD-lightgrey?style=flat-square" alt="License">
</p>

---

## ðŸ“Œ Overview

Live API Inspector lets you spin up a public endpoint, send HTTP requests to it from anywhere (Stripe, GitHub, your own backend), and watch them appear **instantly** in your browser â€” no refresh, no polling.

It provides:

- Real-time request capture
- Live request stream via WebSockets
- Full request details: method, headers, body, query, timestamp
- Replay captured requests to any target URL
- Multi-endpoint support (one slug per endpoint)
- Persistent request history per endpoint
- Landing, docs, and pricing pages
- Dark, modern inspector UI
- Regenerate endpoint slug on demand
- Zero-config local setup
- Packaged Windows desktop app (Electron)

---

## ðŸ–¼ï¸ Preview

<!-- Preview image not yet included. Add a screenshot at docs/preview.png -->

<p align="center">
  <img src="./docs/preview.png" alt="Live API Inspector Preview" width="700">
</p>

---

## ðŸ“¥ Download

Pre-built Windows executable â€” no Node.js installation required.

<p align="center">
  <a href="https://github.com/programmingpioneer/live-api-inspector/releases/latest/download/Live-API-Inspector-Setup.exe">
    <img src="https://img.shields.io/badge/Download-Live--API--Inspector--Setup.exe-brightgreen?style=for-the-badge&logo=windows" alt="Download EXE">
  </a>
</p>

| Platform       | File                              | Status | Download |
| -------------- | --------------------------------- | ------ | -------- |
| Windows 64-bit | `Live-API-Inspector-Setup.exe`    | Stable | [â¬‡ï¸ Download](https://github.com/programmingpioneer/live-api-inspector/releases/latest/download/Live-API-Inspector-Setup.exe) |

### Run

1. Download `Live-API-Inspector-Setup.exe`
2. Run the installer (or the portable build)
3. Launch **Live API Inspector** from Start Menu
4. The desktop app opens with the inspector already running

---

## ðŸ“¦ Releases

| Version | Release Date   | Status     | Download |
| ------- | -------------- | ---------- | -------- |
| v1.0.0  | September 2026 | âœ… Stable | [Live-API-Inspector-Setup.exe](https://github.com/programmingpioneer/live-api-inspector/releases/latest/download/Live-API-Inspector-Setup.exe) |

---

## âœ¨ Features

### ðŸ”Œ Endpoint Management

- Create inspector endpoints
- Auto-generated slugs
- Regenerate slug on demand
- Multiple endpoints per app
- Endpoint history persistence
- Endpoint list view

### ðŸ“¡ Real-Time Capture

- Ingest any HTTP request (any method)
- Capture method, path, headers, body, query, timestamp
- Socket.IO live stream
- Zero-refresh UI updates
- Per-endpoint rooms
- Reconnect on network loss

### ðŸ” Request Inspection

- Full request details panel
- Pretty-printed JSON body
- Header inspection
- Query parameter view
- Raw body view
- Empty states for no requests
- Loading skeletons

### ðŸ” Replay Engine

- Replay any captured request
- Target any URL
- Real HTTP request from backend
- Replay drawer UI
- Result feedback

### ðŸŽ¨ UI / UX

- Dark theme
- Responsive interface
- Landing / Docs / Pricing pages
- WebGL background on landing
- Command palette
- Toast notifications
- Smooth transitions and animations
- Reduced-motion support
- Skeleton loading states
- Accessible markup

### ðŸ–¥ï¸ Desktop App

- Electron-wrapped desktop build
- Bundled NestJS backend
- Bundled Next.js frontend
- Single-click launch
- No terminal required
- Auto port selection
- Graceful shutdown

---

## ðŸ› ï¸ Tech Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Backend          | NestJS 12                      |
| Realtime         | Socket.IO 4.8                  |
| Validation       | Zod 4                          |
| Frontend         | Next.js 16 (App Router)        |
| UI               | React 19, CSS Modules          |
| HTTP Client      | fetch + socket.io-client 4.8   |
| Storage          | Local JSON file                |
| Desktop          | Electron + electron-builder    |
| Language         | TypeScript 5.6 / TypeScript 6  |
| Runtime          | Node.js 20+                    |

---

## ðŸ“‹ Requirements

- Node.js 20 or newer
- npm 10 or newer
- Git
- Windows / Linux / macOS

After dependencies are installed, the core application does **not** require any external database or cloud service.

---

## ðŸš€ Installation

### Windows

```powershell
git clone https://github.com/programmingpioneer/live-api-inspector.git
cd live-api-inspector

# backend
cd backend
npm install

# frontend
cd ..\frontend
npm install
```

### Linux / macOS

```
git clone https://github.com/programmingpioneer/live-api-inspector.git
cd live-api-inspector

cd backend && npm install
cd ../frontend && npm install
```

---

## ðŸ First Run

```
Start Backend
      â†“
Start Frontend
      â†“
Open Browser
      â†“
Create Endpoint
      â†“
Send Request
      â†“
Watch It Appear Live
```

### Setup Steps

1. Start the backend: `cd backend && npm run start:dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)
4. Click **Create free endpoint**
5. Copy the slug
6. Send a test request (see below)
7. Watch the request appear **instantly**

---

## ðŸ”‘ Environment Variables

| Location â†•â–¾ | Variable â†•â–¾ | Purpose â†•â–¾ |
|---|---|---|
| âˆ’frontend | `NEXT_PUBLIC_API_URL` | Backend base URL (default `http://localhost:4000`) |
| âˆ’backend | see `backend/.env.example` | Backend runtime configuration |
âš™

Frontend template: `frontend/.env.local.example`

---

## ðŸ’¾ Data Storage

### Request History

Captured requests are stored in a local JSON file:

```
backend/.devtoll-data/endpoints.json
```

### Uploaded Files

No external file uploads are used in V1.

### Backups

There is no built-in backup UI in V1 â€” the JSON file is portable and can be copied or versioned manually.

> Keep `.devtoll-data/` out of version control. It changes at runtime and is environment-specific.

---

## ðŸ”’ Security

- Zod schema validation on all inbound payloads
- Backend has no auth in V1 (local-only tool)
- No credentials hard-coded into source
- No external database to protect
- Socket.IO rooms scoped by slug
- Request body size limits enforced
- CORS restricted to localhost origins in dev

```
Browser Input
     â†“
Validation
     â†“
Business Logic
     â†“
Persistence
```

The frontend is treated as untrusted for anything beyond UI state.

> **Note:** V1 is designed for **local development use**. Do not expose the backend port publicly without adding authentication.

---

## ðŸ—ï¸ Architecture

```
                Client Browser
                      â”‚
                      â–¼
              Next.js Frontend :3000
                      â”‚
       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
       â”‚              â”‚              â”‚
       â–¼              â–¼              â–¼
   REST API      Socket.IO      Static Pages
       â”‚              â”‚
       â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
              â–¼
        NestJS Backend :4000
              â”‚
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â–¼          â–¼          â–¼
ingest    replay    persistence
module    module    module
              â”‚
              â–¼
      .devtoll-data/endpoints.json
```

- Frontend renders UI and holds the socket connection.
- Backend ingests incoming requests, persists them, and broadcasts to rooms.
- Persistence is a simple JSON file in V1.
- Replay makes outbound HTTP calls from the backend to the target URL.

---

## ðŸ“‚ Project Structure

```
live-api-inspector/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ endpoints/
â”‚   â”‚   â”‚   â”œâ”€â”€ endpoints.controller.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ endpoints.module.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ endpoints.schema.ts
â”‚   â”‚   â”‚   â””â”€â”€ endpoints.service.ts
â”‚   â”‚   â”œâ”€â”€ gateway/
â”‚   â”‚   â”‚   â”œâ”€â”€ gateway.gateway.ts
â”‚   â”‚   â”‚   â””â”€â”€ gateway.module.ts
â”‚   â”‚   â”œâ”€â”€ ingest/
â”‚   â”‚   â”‚   â”œâ”€â”€ ingest.controller.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ ingest.module.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ ingest.service.ts
â”‚   â”‚   â”‚   â””â”€â”€ types.ts
â”‚   â”‚   â”œâ”€â”€ persistence/
â”‚   â”‚   â”‚   â”œâ”€â”€ persistence.module.ts
â”‚   â”‚   â”‚   â””â”€â”€ persistence.service.ts
â”‚   â”‚   â”œâ”€â”€ replay/
â”‚   â”‚   â”‚   â”œâ”€â”€ replay.controller.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ replay.module.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ replay.schema.ts
â”‚   â”‚   â”‚   â””â”€â”€ replay.service.ts
â”‚   â”‚   â”œâ”€â”€ app.module.ts
â”‚   â”‚   â””â”€â”€ main.ts
â”‚   â”œâ”€â”€ .env.example
â”‚   â”œâ”€â”€ nest-cli.json
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ tsconfig.json
â”‚
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ about/
â”‚   â”‚   â”œâ”€â”€ changelog/
â”‚   â”‚   â”œâ”€â”€ contact/
â”‚   â”‚   â”œâ”€â”€ docs/
â”‚   â”‚   â”œâ”€â”€ endpoints/
â”‚   â”‚   â”œâ”€â”€ features/
â”‚   â”‚   â”œâ”€â”€ inspect/[slug]/
â”‚   â”‚   â”œâ”€â”€ pricing/
â”‚   â”‚   â”œâ”€â”€ privacy/
â”‚   â”‚   â”œâ”€â”€ product/
â”‚   â”‚   â”œâ”€â”€ terms/
â”‚   â”‚   â”œâ”€â”€ globals.css
â”‚   â”‚   â”œâ”€â”€ layout.tsx
â”‚   â”‚   â””â”€â”€ page.tsx
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ inspector/
â”‚   â”‚   â”œâ”€â”€ ui/
â”‚   â”‚   â””â”€â”€ *.tsx
â”‚   â”œâ”€â”€ hooks/
â”‚   â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ .env.local.example
â”‚   â”œâ”€â”€ next.config.ts
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ tsconfig.json
â”‚
â”œâ”€â”€ electron/
â”‚   â”œâ”€â”€ main.js
â”‚   â”œâ”€â”€ preload.js
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ electron-builder.yml
â”‚
â”œâ”€â”€ scripts/
â”‚   â”œâ”€â”€ build.ps1
â”‚   â”œâ”€â”€ build-exe.ps1
â”‚   â”œâ”€â”€ dev.ps1
â”‚   â””â”€â”€ README.md
â”‚
â”œâ”€â”€ .github/
â”‚   â”œâ”€â”€ workflows/
â”‚   â”œâ”€â”€ ISSUE_TEMPLATE/
â”‚   â””â”€â”€ PULL_REQUEST_TEMPLATE/
â”‚
â”œâ”€â”€ .gitignore
â”œâ”€â”€ ELECTRON_BUILD.md
â””â”€â”€ README.md
```

---

## ðŸ”Œ API Endpoints

| Method â†•â–¾ | Endpoint â†•â–¾ | Purpose â†•â–¾ |
|---|---|---|
| âˆ’POST | `/api/v1/endpoints` | Create a new inspector endpoint (returns `{ slug }`) |
| âˆ’POST | `/api/v1/inspect/:slug` | Ingest an incoming request |
| âˆ’GET | `/api/v1/inspect/:slug/requests` | Fetch captured request history |
| âˆ’POST | `/api/v1/replay` | Replay a captured request (`{ requestId, targetUrl }`) |
âš™

### Socket.IO

- Namespace: `/inspector`
- Client emits: `room:join { slug }`
- Server emits: `request:captured`

---

## ðŸ§ª Testing

### Build Test

```
cd backend; npm run build
cd ..\frontend; npm run build
```

### Live Flow Test

```
# create endpoint
$created = Invoke-RestMethod `
    -Uri "http://localhost:4000/api/v1/endpoints" `
    -Method POST `
    -ContentType "application/json" `
    -Body "{}"

$slug = $created.slug
$slug

# open in browser
Start-Process "http://localhost:3000/inspect/$slug"

# send a test event
$body = @{ event = "payment.completed"; amount = 4999 } | ConvertTo-Json
Invoke-RestMethod `
    -Uri "http://localhost:4000/api/v1/inspect/$slug" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

The request must appear in the browser **instantly** â€” no refresh.

### Desktop App Test

```
cd scripts
.\build-exe.ps1
```

Then launch the built EXE from `electron/dist/`.

---

## ðŸ› Troubleshooting

| Problem â†•â–¾ | Possible Solution â†•â–¾ |
|---|---|
| âˆ’`port 4000 already in use` | Kill the process on 4000 or change backend port |
| âˆ’`port 3000 already in use` | Kill the process on 3000 or change frontend port |
| âˆ’Socket does not connect | Verify `NEXT_PUBLIC_API_URL` matches the backend URL |
| âˆ’Requests don't appear live | Check browser console for Socket.IO errors |
| âˆ’`next build` fails on CI | Ensure `NEXT_PUBLIC_API_URL` is set at build time |
| âˆ’Electron window is blank | Backend/frontend may not have started â€” check logs in dev console |
| âˆ’EXE fails to launch | Run from terminal to see stderr, or check Windows Event Viewer |
| âˆ’`.devtoll-data` file corrupt | Delete it and restart â€” the app recreates the file |
âš™

---

## ðŸ—ºï¸ Roadmap

### V1 â€” Local Inspector âœ…

- âœ… Real-time capture
- âœ… Live socket stream
- âœ… Replay engine
- âœ… Multi-endpoint
- âœ… Persistent JSON history
- âœ… Dark UI
- âœ… Desktop app (Electron)

### V2 â€” Persistence & Auth

- Database-backed storage (PostgreSQL / TiDB)
- User accounts and API keys
- Per-endpoint retention policies
- Custom domains
- Request search and filters

### V3 â€” Cloud Platform

- Hosted inspector
- Team workspaces
- Webhook signing and verification
- Webhook forwarding rules
- Usage analytics

### Future Features

- Request diff view
- Response assertion testing
- Scheduled replays
- CLI tool
- VS Code extension
- Mobile app

---

## ðŸ“Œ Release Information

### Current Release

**V1.0.0 â€” Live Edition**

### Release Date

**September 2026**

### Release Status

```
Stable
Local-First
Desktop-Ready
```

### What's Included in V1

- Complete live inspector
- Real-time WebSocket capture
- Replay engine
- Persistent history
- Landing / docs / pricing pages
- Dark modern UI
- Electron desktop app
- PowerShell build scripts
- GitHub CI + release workflows

### Download
<p align="center">
  <a href="https://github.com/programmingpioneer/live-api-inspector/releases/latest/download/Live-API-Inspector-Setup.exe">
    <img src="https://img.shields.io/badge/Download-v1.0.0-brightgreen?style=for-the-badge&logo=windows" alt="Download v1.0.0">
  </a>
</p>
---

## ðŸ¤ Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update documentation when required
5. Test the application
6. Commit your changes
7. Open a Pull Request

For larger changes, explain the purpose and expected behavior in the pull request.

See [`.github/CONTRIBUTING.md`](https://.github/CONTRIBUTING.md) for the full guide.

---

## ðŸ“„ License

No license specified yet.

---

## â­ Project Goal

Live API Inspector is built as a practical, real-world developer tool rather than a demo.

The project focuses on:

```
Real-time developer workflow
        +
Clean backend architecture
        +
Live socket streaming
        +
Practical local persistence
        +
Maintainable TypeScript
```

The long-term goal is to evolve the project from a **local inspector** into a **full cloud platform** for teams â€” with authentication, multi-tenant storage, and webhook forwarding.

---
<p align="center"><strong>Live API Inspector V1.0.0 â€” 2026</strong></p><p align="center">Made with â¤ï¸ using NestJS, Next.js, Socket.IO & Electron.</p>
