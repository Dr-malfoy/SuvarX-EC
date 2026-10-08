Add-Type -AssemblyName System.IO.Compression.FileSystem

$baseDir = "H:\Buisness Project\suvro-main"
$deployDir = Join-Path $baseDir "cpanel_deploy"

if (-not (Test-Path $deployDir)) {
    New-Item -ItemType Directory -Path $deployDir -Force | Out-Null
}

# 1. Backend Package
$backendDir = Join-Path $baseDir "suvro-main\backend"
$backendZip = Join-Path $deployDir "backend_cpanel_api.backend.suvarx.com.zip"
if (Test-Path $backendZip) { Remove-Item $backendZip -Force }

$tempB = Join-Path $env:TEMP ("b_build_" + [Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempB -Force | Out-Null

Get-ChildItem -Path $backendDir -Force -Exclude "node_modules", "*.log" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $tempB -Recurse -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempB, $backendZip)
Remove-Item -Path $tempB -Recurse -Force
Write-Host "Created backend zip at: $backendZip"

# 2. Frontend Package (Pure Production Runtime)
$frontendDir = Join-Path $baseDir "suvro-main\frontend"
$frontendZip = Join-Path $deployDir "frontend_cpanel_shop.suvarx.com.zip"
if (Test-Path $frontendZip) { Remove-Item $frontendZip -Force }

$tempF = Join-Path $env:TEMP ("f_build_" + [Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempF -Force | Out-Null

Get-ChildItem -Path $frontendDir -Force -Exclude "node_modules", "*.log", "package-lock.json" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $tempF -Recurse -Force
}

# Write production-only package.json (no build/dev dependencies, no caniuse-lite, no prisma)
$prodPkg = @{
    name = "suvar"
    version = "0.1.0"
    private = $true
    main = "server.js"
    scripts = @{
        start = "node server.js"
    }
    dependencies = @{
        "@stripe/react-stripe-js" = "^6.2.0"
        "@stripe/stripe-js" = "^9.3.0"
        "bcryptjs" = "^3.0.3"
        "cloudinary" = "^2.9.0"
        "framer-motion" = "^12.38.0"
        "next" = "16.2.4"
        "next-auth" = "^4.24.14"
        "react" = "19.2.4"
        "react-dom" = "19.2.4"
        "stripe" = "^22.0.2"
    }
} | ConvertTo-Json -Depth 5

Set-Content -Path (Join-Path $tempF "package.json") -Value $prodPkg -Encoding UTF8

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempF, $frontendZip)
Remove-Item -Path $tempF -Recurse -Force
Write-Host "Created frontend zip at: $frontendZip"

# 3. Copy database.sql
$dbFile = Join-Path $backendDir "database.sql"
Copy-Item -Path $dbFile -Destination (Join-Path $deployDir "database.sql") -Force
Write-Host "Copied database.sql"

# 4. Create Combined Full Deployment Zip
$fullZip = Join-Path $deployDir "FULL_PROJECT_cpanel_suvarx.zip"
if (Test-Path $fullZip) { Remove-Item $fullZip -Force }

$tempFull = Join-Path $env:TEMP ("full_build_" + [Guid]::NewGuid().ToString())
$tempFullBackend = Join-Path $tempFull "backend"
$tempFullFrontend = Join-Path $tempFull "frontend"

New-Item -ItemType Directory -Path $tempFullBackend -Force | Out-Null
New-Item -ItemType Directory -Path $tempFullFrontend -Force | Out-Null

Get-ChildItem -Path $backendDir -Force -Exclude "node_modules", "*.log" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $tempFullBackend -Recurse -Force
}

Get-ChildItem -Path $frontendDir -Force -Exclude "node_modules", "*.log", "package-lock.json" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $tempFullFrontend -Recurse -Force
}
Set-Content -Path (Join-Path $tempFullFrontend "package.json") -Value $prodPkg -Encoding UTF8

Copy-Item -Path (Join-Path $deployDir "CPANEL_DEPLOYMENT_GUIDE.md") -Destination $tempFull -Force
Copy-Item -Path $dbFile -Destination $tempFull -Force

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempFull, $fullZip)
Remove-Item -Path $tempFull -Recurse -Force
Write-Host "Created full bundle zip at: $fullZip"
