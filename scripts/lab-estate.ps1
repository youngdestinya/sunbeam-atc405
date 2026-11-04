param([ValidateSet('Start','Stop','Status')][string]$Action='Status')
$ErrorActionPreference='Stop'
$vbox='C:\Program Files\Oracle\VirtualBox\VBoxManage.exe'
foreach($vm in @('sunbeam-iaas','sunbeam-paas')) {
    $details=& $vbox showvminfo $vm --machinereadable
    if($LASTEXITCODE -ne 0){throw "Cannot inspect $vm."}
    $state=($details | Select-String '^VMState=').Line
    Write-Host "$vm : $state"
    if($Action -eq 'Start' -and $state -eq 'VMState="poweroff"') {
        & $vbox startvm $vm --type headless
    } elseif($Action -eq 'Stop' -and $state -eq 'VMState="running"') {
        & $vbox controlvm $vm acpipowerbutton
        Write-Host 'Clean shutdown requested. Wait for the VM to stop; no forced power-off is performed.'
    }
}
if($Action -ne 'Stop') {
    Write-Host 'Docker: http://localhost:8081 | Dokku: http://localhost:8082'
    Write-Host 'After Start, allow the guests time to boot before opening the apps.'
}
