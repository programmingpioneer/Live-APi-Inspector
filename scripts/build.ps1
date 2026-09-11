<#
.SYNOPSIS
    Build backend + frontend for production.

.DESCRIPTION
    Runs the production build for both packages.
    Output:
      - backend/dist           (compiled NestJS)
      - frontend/.next         (Next.js build)

.EXAMPLE
    .\build.ps1
#>

[CmdletBinding()]
param(
    [string]$Root = (Resolve-Path "$PSScriptRoot\..").Path
)

$ErrorActionPreference = 'Stop'

function Run-Step {
    param(
        [string]$Name,
        [string]$WorkingDir,
        [string]$Command
    )
    Write-Host "`n=== $Name ===" -ForegroundColor Cyan
    Write-Host "cwd: $WorkingDir" -ForegroundColor DarkGray
    Push-Location $WorkingDir
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            throw "$Name failed with exit code $LASTEXITCODE"
        }
    } finally {
        Pop-Location
    }
}

$backend  = Join-Path $Root 'backend'
$frontend = Join-Path $Root 'frontend'

Write-Host "Live API Inspector — Production Build" -ForegroundColor Green
Write-Host "Root: $Root" -ForegroundColor DarkGray

Run-Step -Name 'Install backend deps'  -WorkingDir $backend  -Command 'npm ci'
Run-Step -Name 'Build backend'         -WorkingDir $backend  -Command 'npm run build'

Run-Step -Name 'Install frontend deps' -WorkingDir $frontend -Command 'npm ci'
Run-Step -Name 'Build frontend'        -WorkingDir $frontend -Command 'npm run build'

Write-Host "`n=== Build complete ===" -ForegroundColor Green
Write-Host "Backend:  $backend\dist"     -ForegroundColor DarkGray
Write-Host "Frontend: $frontend\.next"    -ForegroundColor DarkGray
