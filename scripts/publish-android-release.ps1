$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$pubspecPath = Join-Path $repoRoot 'mobile\bonnetje_app\pubspec.yaml'
$apkSource = Join-Path $repoRoot 'mobile\bonnetje_app\build\app\outputs\flutter-apk\app-release.apk'
$aabSource = Join-Path $repoRoot 'mobile\bonnetje_app\build\app\outputs\bundle\release\app-release.aab'
$downloadsDir = Join-Path $repoRoot 'public\downloads'

if (-not (Test-Path $pubspecPath)) {
    throw "pubspec.yaml niet gevonden op $pubspecPath"
}

if (-not (Test-Path $apkSource)) {
    throw "Release APK niet gevonden op $apkSource. Draai eerst 'flutter build apk --release'."
}

if (-not (Test-Path $aabSource)) {
    throw "Release AAB niet gevonden op $aabSource. Draai eerst 'flutter build appbundle --release'."
}

$pubspecContent = Get-Content $pubspecPath
$versionLine = $pubspecContent | Where-Object { $_ -match '^version:\s*' } | Select-Object -First 1

if (-not $versionLine) {
    throw 'Geen version-regel gevonden in pubspec.yaml'
}

$rawVersion = ($versionLine -replace '^version:\s*', '').Trim()
$splitVersion = $rawVersion -split '\+'
$versionName = $splitVersion[0]
$buildNumber = if ($splitVersion.Length -gt 1) { $splitVersion[1] } else { '1' }
$publishedAt = (Get-Date).ToString('o')

New-Item -ItemType Directory -Path $downloadsDir -Force | Out-Null

$apkTargetVersioned = Join-Path $downloadsDir ("bonnetje-$versionName+$buildNumber.apk")
$aabTargetVersioned = Join-Path $downloadsDir ("bonnetje-$versionName+$buildNumber.aab")
$apkTargetLatest = Join-Path $downloadsDir 'bonnetje-latest.apk'
$aabTargetLatest = Join-Path $downloadsDir 'bonnetje-latest.aab'
$metadataTarget = Join-Path $downloadsDir 'android-release.json'

Copy-Item $apkSource $apkTargetVersioned -Force
Copy-Item $aabSource $aabTargetVersioned -Force
Copy-Item $apkSource $apkTargetLatest -Force
Copy-Item $aabSource $aabTargetLatest -Force

$metadata = [ordered]@{
    version = $versionName
    build = $buildNumber
    published_at = $publishedAt
    apk = [ordered]@{
        url = '/downloads/bonnetje-latest.apk'
        filename = Split-Path $apkTargetVersioned -Leaf
        versioned_url = '/downloads/' + (Split-Path $apkTargetVersioned -Leaf)
    }
    aab = [ordered]@{
        url = '/downloads/bonnetje-latest.aab'
        filename = Split-Path $aabTargetVersioned -Leaf
        versioned_url = '/downloads/' + (Split-Path $aabTargetVersioned -Leaf)
    }
}

$metadata | ConvertTo-Json -Depth 4 | Set-Content -Path $metadataTarget -Encoding UTF8

Write-Host "Android release gepubliceerd naar $downloadsDir"
Write-Host "APK: $apkTargetLatest"
Write-Host "AAB: $aabTargetLatest"
Write-Host "Metadata: $metadataTarget"