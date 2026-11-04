$ErrorActionPreference='Stop'
. "$PSScriptRoot/lab-command.ps1"
. "$PSScriptRoot/lab-ssh.ps1"
$source=Join-Path $SunbeamLabRoot 'sunbeam-source.tar'
Invoke-LabCommand -Phase docker-deploy -Label 'scp -P 2221 sunbeam-source.tar sunbeam@127.0.0.1:/tmp/sunbeam-source.tar (dedicated lab key)' -Executable 'scp.exe' -Arguments (Get-LabScpArguments -Port 2221 -Source $source -Destination '/tmp/sunbeam-source.tar')
foreach($command in @(
    'mkdir -p /home/sunbeam/app',
    'tar -xf /tmp/sunbeam-source.tar -C /home/sunbeam/app',
    'sudo docker build --tag sunbeam:task1 /home/sunbeam/app',
    'sudo docker volume create sunbeam-data',
    'sudo docker run --detach --name sunbeam --restart unless-stopped --publish 3000:3000 --env DEMO_MODE=true --env APP_ORIGIN=http://localhost:8081 --mount type=volume,src=sunbeam-data,dst=/app/data sunbeam:task1'
)) {Invoke-LabCommand -Phase docker-deploy -Label "ssh -p 2221 sunbeam@127.0.0.1 '$command'" -Executable 'ssh.exe' -Arguments (Get-LabSshArguments -Port 2221 -Command $command)}
