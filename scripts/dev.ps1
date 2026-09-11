<#
.SYNOPSIS
    Start backend + frontend for local development in two windows.

.DESCRIPTION
    Opens two new PowerShell windows:
      - One for the NestJS backend (npm run start:dev on :4000)
      - One for the Next.js frontend (npm run dev on :3000)

.EXAMPLE
    .\dev.ps1
#>

[CmdletBinding()]
param(
    [string]$Root = (Resolve-Path "$PSScriptRoot\..").Path
)

$ErrorActionPreference = 'Stop'

Write-Host "Starting Live API Inspector (dev mode)..." -ForegroundColor Cyan
Write-Host "Root: $Root" -ForegroundColor DarkGray

$backend = Join-Path $Root 'backend'
$frontend = Join-Path $Root 'frontend'

if (-not (Test-Path $backend))  { throw "Backend folder not found: $backend" }
if (-not (Test-Path $frontend)) { throw "Frontend folder not found: $frontend" }

Write-Host "`n[1/2] Launching backend (port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "cd `"$backend`"; `$Host.UI.RawUI.WindowTitle = 'Live API Inspector — Backend'; npm run start:dev"
)

Write-Host "[2/2] Launching frontend (port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "cd `"$frontend`"; `$Host.UI.RawUI.WindowTitle = 'Live API Inspector — Frontend'; npm run dev"
)

Start-Sleep -Seconds 3
Write-Host "`nBoth windows should be opening now." -ForegroundColor Green
Write-Host "Open: http://localhost:3000" -ForegroundColor Green
