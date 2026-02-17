Write-Host "Starting Build and Package Process..." -ForegroundColor Green

# 1. Build
Write-Host "Building project (this may take a while)..." -ForegroundColor Cyan
cmd /c "npm run build"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Please check errors above."
    exit 1
}

# 2. Define Paths
$dest = ".next\standalone"
$staticDest = "$dest\.next\static"
$publicDest = "$dest\public"

# 3. Copy Static Assets
Write-Host "Copying static assets..." -ForegroundColor Cyan
if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
if (-not (Test-Path "$dest\.next")) { New-Item -ItemType Directory -Path "$dest\.next" -Force | Out-Null }

# Copy .next/static -> .next/standalone/.next/static
Copy-Item -Path ".next\static" -Destination "$dest\.next" -Recurse -Force

# Copy public -> .next/standalone/public
if (Test-Path "public") {
    Copy-Item -Path "public" -Destination $dest -Recurse -Force
} else {
    Write-Host "Warning: 'public' folder not found. Skipping." -ForegroundColor Yellow
}

# 4. Copy Deployment Files
Write-Host "Copying Prisma, DB, and Config files..." -ForegroundColor Cyan
Copy-Item -Path "prisma" -Destination $dest -Recurse -Force
Copy-Item -Path "db.json" -Destination $dest -Force
if (Test-Path ".npmrc") { Copy-Item -Path ".npmrc" -Destination $dest -Force }

# 5. Update package.json scripts
Write-Host "Updating standalone package.json scripts..." -ForegroundColor Cyan
$rootPkg = Get-Content "package.json" | ConvertFrom-Json
$stdPkgPath = "$dest\package.json"
if (Test-Path $stdPkgPath) {
    $stdPkg = Get-Content $stdPkgPath | ConvertFrom-Json
    $stdPkg.scripts = $rootPkg.scripts
    $stdPkg | ConvertTo-Json -Depth 10 | Set-Content $stdPkgPath
}

# 6. Zip
Write-Host "Creating deployment zip..." -ForegroundColor Cyan
$zipFile = "deploy_package.zip"
if (Test-Path $zipFile) { Remove-Item $zipFile }
Compress-Archive -Path "$dest\*" -DestinationPath $zipFile

Write-Host "Success! Upload 'deploy_package.zip' to Plesk." -ForegroundColor Green
