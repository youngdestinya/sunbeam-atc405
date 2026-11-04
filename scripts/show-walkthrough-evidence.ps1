# Read-only evidence view for the screen portion of the three-minute recording.
$ErrorActionPreference='Stop'
$vbox='C:\Program Files\Oracle\VirtualBox\VBoxManage.exe'
Write-Host "`nSUNBEAM — AGL202607071 — D=1 — SMALL TIER`n" -ForegroundColor Yellow
Write-Host 'Running VirtualBox estate:'
& $vbox list runningvms
Write-Host "`nRecorded application deployment command counts:"
$entries=@(Get-Content (Join-Path $PSScriptRoot '../docs/lab-evidence/commands.jsonl') | ForEach-Object {$_|ConvertFrom-Json})
$entries | Where-Object phase -In @('docker-deploy','dokku-deploy') | Group-Object phase | ForEach-Object {[pscustomobject]@{Deployment=$_.Name;Attempts=$_.Count;Successful=@($_.Group|Where-Object exitCode -EQ 0).Count}} | Format-Table
Write-Host 'Setup and verification commands are separate. Full commands, timestamps, failures and outputs: docs/lab-evidence/COMMAND-COUNTS.md'
Write-Host "`nDocker application: http://localhost:8081"
Invoke-RestMethod 'http://localhost:8081/healthz' | ConvertTo-Json
Write-Host "`nDokku application: http://localhost:8082"
Invoke-RestMethod 'http://localhost:8082/healthz' | ConvertTo-Json
