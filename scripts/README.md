# Scripts

PowerShell helper scripts for building, running, and releasing Live API Inspector.

## Prerequisites

- Windows 10/11
- PowerShell 5.1+ (or PowerShell 7+)
- Node.js 20+
- npm 10+
- GitHub CLI (`gh`) — only for `release.ps1`

## Scripts

### `dev.ps1`

Opens two PowerShell windows — one for the backend, one for the frontend.

```powershell
.\dev.ps1
```

- Backend: `npm run start:dev` on port **4000**
- Frontend: `npm run dev` on port **3000**

Open [http://localhost:3000](http://localhost:3000).

### `build.ps1`

Produces a production build of backend + frontend.

```
.\build.ps1
```

Output:

| Package ↕▾ | Output ↕▾ |
|---|---|
| −backend | `backend/dist/` |
| −frontend | `frontend/.next/` |
⚙

### `build-exe.ps1`

Full Windows EXE build (app + Electron packaging).

```
.\build-exe.ps1
```

Options:

| Flag ↕▾ | Effect ↕▾ |
|---|---|
| −`-SkipAppBuild` | Skip backend/frontend rebuild |
| −`-PortableOnly` | Only produce the portable EXE (no installer) |
⚙

Output: `electron/dist/Live-API-Inspector-Setup.exe` (and portable EXE).

### `release.ps1`

Builds the EXE, tags the commit, and creates a GitHub release with the EXE attached.

```
.\release.ps1 -Version v1.0.0
```

Requires the GitHub CLI:

```
gh auth login
```

## Execution Policy

If Windows blocks the scripts, run:

```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

This only affects the current PowerShell window — nothing global is changed.

