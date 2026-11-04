$ErrorActionPreference='Stop'
. "$PSScriptRoot/lab-command.ps1"
. "$PSScriptRoot/lab-ssh.ps1"
foreach($command in @(
    'sudo dokku apps:create sunbeam',
    'sudo dokku builder:set sunbeam selected dockerfile',
    'sudo dokku storage:ensure-directory sunbeam',
    'sudo install -d -o 1000 -g 1000 -m 750 /var/lib/dokku/data/storage/sunbeam',
    'sudo dokku storage:mount sunbeam /var/lib/dokku/data/storage/sunbeam:/app/data',
    'sudo dokku config:set --no-restart sunbeam NODE_ENV=production DEMO_MODE=true HOST=0.0.0.0 PORT=3000 DATA_DIR=/app/data APP_ORIGIN=http://localhost:8082 SECURE_COOKIE=false',
    'sudo dokku domains:set sunbeam localhost',
    'sudo dokku ports:set sunbeam http:80:3000'
)) {Invoke-LabCommand -Phase dokku-deploy -Label "ssh -p 2222 sunbeam@127.0.0.1 '$command'" -Executable ssh.exe -Arguments (Get-LabSshArguments -Port 2222 -Command $command)}
Invoke-LabCommand -Phase dokku-deploy -Label 'git remote add dokku-lab ssh://dokku@127.0.0.1:2222/sunbeam' -Executable git.exe -Arguments @('remote','add','dokku-lab','ssh://dokku@127.0.0.1:2222/sunbeam')
$sshCommand='C:/Windows/System32/OpenSSH/ssh.exe -i C:/Users/young/SunbeamLab/id_ed25519 -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=C:/Users/young/SunbeamLab/known_hosts'
Invoke-LabCommand -Phase dokku-deploy -Label 'git -c core.sshCommand="<dedicated local lab key and known_hosts>" push dokku-lab HEAD:main' -Executable git.exe -Arguments @('-c',"core.sshCommand=$sshCommand",'push','dokku-lab','HEAD:main')
