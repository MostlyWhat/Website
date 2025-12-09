# Database Restore Script
# 
# Restore a PostgreSQL backup

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    [string]$DatabaseUrl = $env:DATABASE_URL
)

if (!(Test-Path $BackupFile)) {
    Write-Error "Backup file not found: $BackupFile"
    exit 1
}

# Parse database URL
if ($DatabaseUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)") {
    $DbUser = $matches[1]
    $DbPassword = $matches[2]
    $DbHost = $matches[3]
    $DbPort = $matches[4]
    $DbName = $matches[5]
} else {
    Write-Error "Invalid DATABASE_URL format"
    exit 1
}

# Confirmation prompt
Write-Host "WARNING: This will restore the database '$DbName' from backup:" -ForegroundColor Yellow
Write-Host "  File: $BackupFile" -ForegroundColor Yellow
Write-Host "  Host: $DbHost" -ForegroundColor Yellow
Write-Host ""
$Confirm = Read-Host "Are you sure you want to continue? (yes/no)"

if ($Confirm -ne "yes") {
    Write-Host "Restore cancelled."
    exit 0
}

# Set PostgreSQL password
$env:PGPASSWORD = $DbPassword

try {
    Write-Host "Restoring database..."

    # Drop existing connections
    Write-Host "Terminating active connections..."
    $terminateQuery = @"
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DbName'
  AND pid <> pg_backend_pid();
"@
    
    & psql -h $DbHost -p $DbPort -U $DbUser -d postgres -c $terminateQuery | Out-Null

    # Restore using pg_restore
    $pgRestoreArgs = @(
        "-h", $DbHost,
        "-p", $DbPort,
        "-U", $DbUser,
        "-d", $DbName,
        "-c",  # Clean (drop) database objects before recreating
        "-v",  # Verbose
        $BackupFile
    )

    & pg_restore @pgRestoreArgs

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database restored successfully!" -ForegroundColor Green
    } else {
        Write-Error "Restore failed with exit code $LASTEXITCODE"
        exit 1
    }
} catch {
    Write-Error "Restore failed: $_"
    exit 1
} finally {
    Remove-Item env:PGPASSWORD -ErrorAction SilentlyContinue
}

# Example usage:
# .\restore-database.ps1 -BackupFile ".\backups\backup_dbname_2024-01-15_10-30-00.sql.gz"
