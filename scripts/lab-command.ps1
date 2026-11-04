function Invoke-LabCommand {
    param(
        [Parameter(Mandatory)][string]$Phase,
        [Parameter(Mandatory)][string]$Label,
        [Parameter(Mandatory)][string]$Executable,
        [string[]]$Arguments = @()
    )
    $evidencePath = Join-Path $PSScriptRoot '../docs/lab-evidence'
    New-Item -ItemType Directory -Force $evidencePath | Out-Null
    $ledgerPath = Join-Path $evidencePath 'commands.jsonl'
    $ledgerMutex = [Threading.Mutex]::new($false,'Local\SunbeamLabCommandLedger')
    if (-not $ledgerMutex.WaitOne(5000)) { throw 'Could not acquire command-ledger lock.' }
    try {
        $counterPath = Join-Path 'C:\Users\young\SunbeamLab' 'command-counter.txt'
        $previousMax = if (Test-Path $ledgerPath) { (Get-Content $ledgerPath | ForEach-Object { ($_ | ConvertFrom-Json).sequence } | Measure-Object -Maximum).Maximum } else { 0 }
        $reservedMax = if (Test-Path $counterPath) { [int](Get-Content $counterPath) } else { 0 }
        $sequence = [int]([Math]::Max($previousMax,$reservedMax) + 1)
        $sequence | Set-Content -LiteralPath $counterPath
    } finally { $ledgerMutex.ReleaseMutex() }
    $started = [DateTimeOffset]::UtcNow.ToString('o')
    $outputPath = Join-Path $evidencePath ('{0:D3}-{1}.txt' -f $sequence,$Phase)
    "[$Phase #$sequence] $Label" | Write-Host
    & $Executable @Arguments 2>&1 | Tee-Object -FilePath $outputPath | ForEach-Object { Write-Host $_ }
    $exitStatus = $LASTEXITCODE
    $entry = [ordered]@{sequence=$sequence;phase=$Phase;command=$Label;startedUtc=$started;endedUtc=[DateTimeOffset]::UtcNow.ToString('o');exitCode=$exitStatus;outputFile=[IO.Path]::GetFileName($outputPath)} | ConvertTo-Json -Compress
    if (-not $ledgerMutex.WaitOne(5000)) { throw 'Could not acquire command-ledger lock.' }
    try { $entry | Add-Content -LiteralPath $ledgerPath -Encoding utf8 } finally { $ledgerMutex.ReleaseMutex(); $ledgerMutex.Dispose() }
    if ($exitStatus -ne 0) { throw "Command $sequence failed with exit code $exitStatus. The attempt is retained in the ledger." }
}

