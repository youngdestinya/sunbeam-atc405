$ledger = Join-Path $PSScriptRoot '../docs/lab-evidence/commands.jsonl'
$entries = @(Get-Content $ledger | ForEach-Object { $_ | ConvertFrom-Json } | Sort-Object sequence)
$lines = [Collections.Generic.List[string]]::new()
$lines.Add('# Actual command counts — Sunbeam local deployment')
$lines.Add('')
$lines.Add('Student AGL202607071 · D=1 · Small tier · 4 November 2026.')
$lines.Add('')
$lines.Add('These are executed invocations, not the earlier template counts. Each invocation has a sequence number, UTC timestamps, exit code and output file in commands.jsonl. Installation scripts perform internal commands and are counted as script invocations only; source-transfer and configuration calls are included in each deployment phase. Automated HTTP assertions inside the verification script are one verifier invocation, not separate manually entered commands. Preflight probes and host downloads before the ledger began are described separately in README.md and are not claimed in its totals.')
$lines.Add('')
$lines.Add('| Phase | Executed attempts | Successful | Failed |')
$lines.Add('|---|---:|---:|---:|')
foreach($group in ($entries | Group-Object phase)) {
    $ok=@($group.Group | Where-Object exitCode -eq 0).Count
    $lines.Add("| $($group.Name) | $($group.Count) | $ok | $($group.Count-$ok) |")
}
foreach($group in ($entries | Group-Object phase)) {
    $lines.Add('');$lines.Add("## $($group.Name)");$lines.Add('')
    foreach($entry in $group.Group){$lines.Add("$($entry.sequence). Exit $($entry.exitCode): ``$($entry.command)`` — output: $($entry.outputFile)")}
}
$lines | Set-Content -LiteralPath (Join-Path $PSScriptRoot '../docs/lab-evidence/COMMAND-COUNTS.md') -Encoding utf8
Write-Output "Updated command counts from $($entries.Count) executed invocations."
