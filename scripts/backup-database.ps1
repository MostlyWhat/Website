# Automated Database Backup Script
# 
# This PowerShell script creates automated PostgreSQL backups with retention policy

param(
    [string]$BackupDir = ".\backups",
    [int]$RetentionDays = 30,
    [string]$DatabaseUrl = $env:DATABASE_URL
)

# Create backup directory if it doesn't exist
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

# Parse database URL (format: postgresql://user:pass@host:port/dbname)
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

# Set PostgreSQL password environment variable
$env:PGPASSWORD = $DbPassword

# Generate backup filename with timestamp
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupFile = Join-Path $BackupDir "backup_${DbName}_${Timestamp}.sql.gz"

Write-Host "Creating backup: $BackupFile"

try {
    # Create backup using pg_dump with compression
    $pgDumpArgs = @(
        "-h", $DbHost,
        "-p", $DbPort,
        "-U", $DbUser,
        "-F", "c",  # Custom format (compressed)
        "-b",       # Include large objects
        "-v",       # Verbose
        "-f", $BackupFile,
        $DbName
    )

    & pg_dump @pgDumpArgs

    if ($LASTEXITCODE -eq 0) {
        $BackupSize = (Get-Item $BackupFile).Length / 1MB
        Write-Host "Backup completed successfully! Size: $([math]::Round($BackupSize, 2)) MB"
    } else {
        Write-Error "Backup failed with exit code $LASTEXITCODE"
        exit 1
    }
} catch {
    Write-Error "Backup failed: $_"
    exit 1
} finally {
    # Clear password from environment
    Remove-Item env:PGPASSWORD -ErrorAction SilentlyContinue
}

# Cleanup old backups
Write-Host "Cleaning up backups older than $RetentionDays days..."
$CutoffDate = (Get-Date).AddDays(-$RetentionDays)
Get-ChildItem -Path $BackupDir -Filter "backup_*.sql.gz" | 
    Where-Object { $_.LastWriteTime -lt $CutoffDate } |
    ForEach-Object {
        Write-Host "Deleting old backup: $($_.Name)"
        Remove-Item $_.FullName -Force
    }

Write-Host "Backup process completed!"

# Example usage:
# .\backup-database.ps1
# .\backup-database.ps1 -BackupDir "D:\Backups" -RetentionDays 60
