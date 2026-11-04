$ErrorActionPreference = 'Stop'
. "$PSScriptRoot/lab-command.ps1"
$labRoot = 'C:\Users\young\SunbeamLab'
$vbox = 'C:\Program Files\Oracle\VirtualBox\VBoxManage.exe'
$ova = Join-Path $labRoot 'downloads/noble-server-cloudimg-amd64.ova'
$checksums = Get-Content (Join-Path $labRoot 'downloads/SHA256SUMS')
$checksumLine = $checksums | Where-Object { $_ -match '\*noble-server-cloudimg-amd64\.ova$' }
if (-not $checksumLine) { throw 'OVA checksum missing from official checksum list.' }
$expected = ($checksumLine -split '\s+')[0]
$actual = (Get-FileHash -LiteralPath $ova -Algorithm SHA256).Hash
if ($actual -ne $expected) { throw 'Incomplete or invalid Ubuntu OVA. Do not boot it.' }
"Ubuntu OVA SHA256 verified: $actual" | Tee-Object -FilePath (Join-Path $PSScriptRoot '../docs/lab-evidence/ubuntu-image-verification.txt')
$extractPath = Join-Path $labRoot 'ubuntu-image'
New-Item -ItemType Directory -Force $extractPath | Out-Null
Invoke-LabCommand -Phase setup -Label "tar -xf $ova -C $extractPath" -Executable 'tar.exe' -Arguments @('-xf',$ova,'-C',$extractPath)
$disk = Get-ChildItem -LiteralPath $extractPath -Filter '*.vmdk' | Select-Object -First 1
if (-not $disk) { throw 'No VMDK in Ubuntu image.' }
foreach ($name in @('sunbeam-iaas','sunbeam-paas')) {
    $targetDisk = Join-Path $labRoot "vms/$name/$name.vdi"
    if (Test-Path $targetDisk) { throw "Disk already exists: $targetDisk. Inspect before retrying." }
    Invoke-LabCommand -Phase setup -Label "VBoxManage clonemedium disk $($disk.FullName) $targetDisk --format VDI" -Executable $vbox -Arguments @('clonemedium','disk',$disk.FullName,$targetDisk,'--format','VDI')
    Invoke-LabCommand -Phase setup -Label "VBoxManage modifymedium disk $targetDisk --resize 20480" -Executable $vbox -Arguments @('modifymedium','disk',$targetDisk,'--resize','20480')
    Invoke-LabCommand -Phase setup -Label "VBoxManage storageattach $name --storagectl SATA --port 0 --device 0 --type hdd --medium $targetDisk" -Executable $vbox -Arguments @('storageattach',$name,'--storagectl','SATA','--port','0','--device','0','--type','hdd','--medium',$targetDisk)
    Invoke-LabCommand -Phase setup -Label "VBoxManage modifyvm $name --boot1 disk --boot2 dvd --boot3 none --boot4 none --graphicscontroller vmsvga" -Executable $vbox -Arguments @('modifyvm',$name,'--boot1','disk','--boot2','dvd','--boot3','none','--boot4','none','--graphicscontroller','vmsvga')
    Invoke-LabCommand -Phase setup -Label "VBoxManage startvm $name --type headless" -Executable $vbox -Arguments @('startvm',$name,'--type','headless')
}
