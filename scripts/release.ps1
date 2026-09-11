<#
.SYNOPSIS
    Create a GitHub release with the built EXE attached.

.DESCRIPTION
    Requires GitHub CLI (gh) installed and authenticated.

    1. Builds the EXE (calls build-exe.ps1).
    2. Creates a git tag.
    3. Pushes the tag.
    4. Creates a GitHub release and uploads the EXE.

.EXAMPLE
    .\release.ps1 -Version v1.0.0
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Version,

    [string]$Root = (Resolve-Path "$PSScriptRoot\..").Path,

    [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'

# Check gh CLI
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI (gh) not found. Install: https://cli.github.com/"
}

$electron = Join-Path $Root 'electron'
$outDir   = Join-Path $electron 'dist'

if (-not $SkipBuild) {
    Write-Host "`n=== Building EXE ===" -ForegroundColor Cyan
    & (Join-Path $PSScriptRoot 'build-exe.ps1') -Root $Root
}

if (-not (Test-Path $outDir)) {
    throw "Build output not found: $outDir"
}

$exes = Get-ChildItem $outDir -Filter *.exe
if ($exes.Count -eq 0) {
    throw "No EXE files found in $outDir"
}

# ── Git tag ─────────────────────────────────────────────────
Push-Location $Root
try {
    Write-Host "`n=== Tagging $Version ===" -ForegroundColor Cyan
    git tag -a $Version -m "Release $Version"
    git push origin $Version
} finally {
    Pop-Location
}

# ── GitHub release ──────────────────────────────────────────
Write-Host "`n=== Creating GitHub release $Version ===" -ForegroundColor Cyan

$exePaths = $exes | ForEach-Object { $_.FullName }

gh release create $Version `
    --title "Live API Inspector $Version" `
    --generate-notes `
    @exePaths

Write-Host "`n=== Release published ===" -ForegroundColor Green
Write-Host "Tag: $Version" -ForegroundColor Green
