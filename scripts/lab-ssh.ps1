$SunbeamLabRoot = 'C:\Users\young\SunbeamLab'
$SunbeamKey = Join-Path $SunbeamLabRoot 'id_ed25519'
$SunbeamKnownHosts = Join-Path $SunbeamLabRoot 'known_hosts'
function Get-LabSshArguments {
    param([int]$Port, [string]$Command)
    @('-i',$SunbeamKey,'-p',"$Port",'-o','IdentitiesOnly=yes','-o','BatchMode=yes','-o','StrictHostKeyChecking=accept-new','-o',"UserKnownHostsFile=$SunbeamKnownHosts",'-o','ConnectTimeout=8','sunbeam@127.0.0.1',$Command)
}
function Get-LabScpArguments {
    param([int]$Port, [string]$Source, [string]$Destination)
    @('-i',$SunbeamKey,'-P',"$Port",'-o','IdentitiesOnly=yes','-o','BatchMode=yes','-o','StrictHostKeyChecking=accept-new','-o',"UserKnownHostsFile=$SunbeamKnownHosts",$Source,"sunbeam@127.0.0.1:$Destination")
}
