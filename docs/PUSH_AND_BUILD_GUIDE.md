# Push & Build Guide

End-to-end workflow for getting Live API Inspector onto GitHub and shipping a
Windows EXE.

## 1. Replace placeholders

Before the first push, find and replace `programmingpioneer` in:

- `README.md`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/CODEOWNERS`
- `.github/CONTRIBUTING.md`

```powershell
Select-String -Path .\README.md, .\.github\* -Recurse -Pattern 'programmingpioneer'
```

Also update any email placeholders:

```
Select-String -Path .\.github\* -Recurse -Pattern 'example\.com'
```

## 2. Push to GitHub

```
cd D:\DevToll

git init
git branch -M main
git add .
git status --short          # verify node_modules / .next / dist are NOT listed
git commit -m "chore: initial commit"

git remote add origin https://github.com/programmingpioneer/live-api-inspector.git
git push -u origin main
```

If `git status --short` shows `node_modules/`, `.next/`, `dist/`, or
`.devtoll-data/` â€” stop and fix `.gitignore` first.

## 3. Build the EXE locally

```
cd scripts
.\build-exe.ps1
```

Output:

- `electron/dist/Live-API-Inspector-Setup.exe`
- `electron/dist/Live-API-Inspector-Portable.exe`

## 4. Create a release

Either locally:

```
cd scripts
.\release.ps1 -Version v1.0.0
```

Or push a tag and let GitHub Actions do it:

```
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

The `.github/workflows/release.yml` workflow will:

1. Build the backend on Windows.
2. Build the frontend on Windows.
3. Package the EXE with electron-builder.
4. Upload the EXE to the GitHub release automatically.

## 5. Verify the release

Open:

```
https://github.com/programmingpioneer/live-api-inspector/releases
```

The release should list:

- `Live-API-Inspector-Setup.exe`
- `Live-API-Inspector-Portable.exe`

Download the installer on a clean Windows machine and confirm it launches.

## Troubleshooting

| Problem â†•â–¾ | Fix â†•â–¾ |
|---|---|
| âˆ’`git push` rejected | Run `git pull --rebase origin main` first |
| âˆ’CI fails on `npm ci` | Lockfile missing â€” run `npm install` locally |
| âˆ’Frontend build fails in CI | `NEXT_PUBLIC_API_URL` missing â€” check workflow |
| âˆ’EXE too large | Trim `node_modules`; check `.npmignore` |
| âˆ’EXE won't launch on another PC | Missing Visual C++ runtime â€” install VC++ redist |
âš™

