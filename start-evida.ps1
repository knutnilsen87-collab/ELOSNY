param(
  [switch]$SkipInstall,
  [switch]$SkipSmoke,
  [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$AppUrl = "http://localhost:4173"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Assert-Command {
  param([string]$CommandName)
  if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
    throw "$CommandName is required but was not found in PATH."
  }
}

function Test-Health {
  try {
    $response = Invoke-WebRequest -UseBasicParsing "$AppUrl/api/health" -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

Set-Location $RepoRoot

Write-Host "Evida launcher" -ForegroundColor Green
Write-Host "Repo: $RepoRoot"

Assert-Command "node"
Assert-Command "npm"

if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot "package.json"))) {
  throw "package.json was not found. Run this script from the Evida repo root."
}

if (-not $SkipInstall) {
  Write-Step "Installing dependencies"
  npm install
}

if (-not $SkipSmoke) {
  Write-Step "Running smoke check"
  npm run smoke
}

if (Test-Health) {
  Write-Step "Evida is already running"
} else {
  Write-Step "Starting Evida server"
  $server = Start-Process -WindowStyle Hidden -FilePath "node" -ArgumentList "apps/server/server.js" -WorkingDirectory $RepoRoot -PassThru

  $ready = $false
  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-Health) {
      $ready = $true
      break
    }
    if ($server.HasExited) {
      throw "Evida server exited before it became ready."
    }
  }

  if (-not $ready) {
    throw "Evida server did not become ready at $AppUrl."
  }
}

Write-Step "Evida is ready"
Write-Host $AppUrl -ForegroundColor Green

if (-not $NoBrowser) {
  Start-Process $AppUrl
}

Write-Host ""
Write-Host "Server is running in the background. To stop it later:" -ForegroundColor Yellow
Write-Host "Get-CimInstance Win32_Process | Where-Object { `$_.Name -eq 'node.exe' -and `$_.CommandLine -like '*apps/server/server.js*' } | ForEach-Object { Stop-Process -Id `$_.ProcessId -Force }"
