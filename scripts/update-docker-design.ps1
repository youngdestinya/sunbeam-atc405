$ErrorActionPreference='Stop'
. "$PSScriptRoot/lab-command.ps1"
. "$PSScriptRoot/lab-ssh.ps1"
Invoke-LabCommand -Phase docker-redesign -Label 'scp -P 2221 sunbeam-luxury-source.tar sunbeam@127.0.0.1:/tmp/sunbeam-luxury-source.tar' -Executable scp.exe -Arguments (Get-LabScpArguments -Port 2221 -Source 'C:\Users\young\SunbeamLab\sunbeam-luxury-source.tar' -Destination '/tmp/sunbeam-luxury-source.tar')
foreach($command in @(
  'tar -xf /tmp/sunbeam-luxury-source.tar -C /home/sunbeam/app',
  'sudo docker build --tag sunbeam:luxury /home/sunbeam/app',
  'sudo docker stop sunbeam',
  'sudo docker rename sunbeam sunbeam-initial',
  'sudo docker run --detach --name sunbeam --restart unless-stopped --publish 3000:3000 --env DEMO_MODE=true --env APP_ORIGIN=http://localhost:8081 --mount type=volume,src=sunbeam-data,dst=/app/data sunbeam:luxury'
)){Invoke-LabCommand -Phase docker-redesign -Label "ssh -p 2221 sunbeam@127.0.0.1 '$command'" -Executable ssh.exe -Arguments (Get-LabSshArguments -Port 2221 -Command $command)}
