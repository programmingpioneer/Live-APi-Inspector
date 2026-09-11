# Build Windows EXE for Live API Inspector
# No params, no help block — just runs the steps.

$ErrorActionPreference = 'Stop'

$root = (Resolve-Path "$PSScriptRoot\..").Path
$backend  = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'
$electron = Join-Path $root 'electron'

Write-Host "Live API Inspector - EXE Build" -ForegroundColor Green
Write-Host "Root: $root" -ForegroundColor DarkGray

# --- 1. Backend build ---
Write-Host "`n=== [1/4] Backend build ===" -ForegroundColor Cyan
Push-Location $backend
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Backend build failed" }
} finally {
    Pop-Location
}

# --- 2. Frontend build ---
Write-Host "`n=== [2/4] Frontend build ===" -ForegroundColor Cyan
$env:NEXT_PUBLIC_API_URL = 'http://localhost:4000'
Push-Location $frontend
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
} finally {
    Pop-Location
    Remove-Item Env:\NEXT_PUBLIC_API_URL -ErrorAction SilentlyContinue
}

# --- 3. Electron packaging ---
Write-Host "`n=== [3/4] Packaging EXE ===" -ForegroundColor Cyan
Push-Location $electron
try {
    npx electron-builder --win
    if ($LASTEXITCODE -ne 0) { throw "electron-builder failed" }
} finally {
    Pop-Location
}

# --- 4. Show output ---
Write-Host "`n=== [4/4] Build complete ===" -ForegroundColor Green
$outDir = Join-Path $electron 'dist'
if (Test-Path $outDir) {
    Get-ChildItem $outDir -Filter *.exe | ForEach-Object {
        $mb = [math]::Round($_.Length / 1MB, 2)
        Write-Host ("  {0,-45} {1,8} MB" -f $_.Name, $mb) -ForegroundColor DarkGray
    }
}