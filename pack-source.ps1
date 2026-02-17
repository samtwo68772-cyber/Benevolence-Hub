Write-Host "Creating Source Code Deployment Package..." -ForegroundColor Green

# 1. Define Exclusions
$exclude = @(
    "node_modules",
    ".next",
    ".git",
    "mysql-data",
    ".vscode",
    ".idea",
    "deploy_package.zip",
    "source_package.zip",
    "build-deploy.ps1",
    "pack-source.ps1",
    "npm-debug.log",
    ".DS_Store"
)

# 2. Get Files to Zip
$files = Get-ChildItem -Path . -Exclude $exclude

# 3. Create Zip
$zipFile = "source_package.zip"
if (Test-Path $zipFile) { Remove-Item $zipFile }

Write-Host "Zipping files (excluding node_modules, .next, etc)..." -ForegroundColor Cyan
Compress-Archive -Path $files -DestinationPath $zipFile

Write-Host "Success! Upload '$zipFile' to Plesk." -ForegroundColor Green
Write-Host "After upload:" -ForegroundColor Yellow
Write-Host "1. Extract the zip in httpdocs" -ForegroundColor Yellow
Write-Host "2. Click 'NPM Install' in Plesk" -ForegroundColor Yellow
Write-Host "3. Run script 'build' in Plesk" -ForegroundColor Yellow
Write-Host "4. Restart Application" -ForegroundColor Yellow
