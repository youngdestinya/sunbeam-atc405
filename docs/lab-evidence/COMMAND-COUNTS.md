# Actual command counts — Sunbeam local deployment

Student AGL202607071 · D=1 · Small tier · 4 November 2026.

These are executed invocations, not the earlier template counts. Each invocation has a sequence number, UTC timestamps, exit code and output file in commands.jsonl. Installation scripts perform internal commands and are counted as script invocations only; source-transfer and configuration calls are included in each deployment phase. Automated HTTP assertions inside the verification script are one verifier invocation, not separate manually entered commands. Preflight probes and host downloads before the ledger began are described separately in README.md and are not claimed in its totals.

| Phase | Executed attempts | Successful | Failed |
|---|---:|---:|---:|
| docker-deploy | 6 | 6 | 0 |
| docker-fit | 6 | 6 | 0 |
| docker-polish | 6 | 6 | 0 |
| docker-redesign | 6 | 6 | 0 |
| docker-reference | 6 | 6 | 0 |
| docker-verify | 3 | 3 | 0 |
| dokku-deploy | 10 | 10 | 0 |
| dokku-fit | 1 | 1 | 0 |
| dokku-redesign | 1 | 1 | 0 |
| dokku-verify | 3 | 3 | 0 |
| fit-verify | 2 | 2 | 0 |
| login-reference | 1 | 1 | 0 |
| platform-evidence | 4 | 4 | 0 |
| redesign-verify | 1 | 1 | 0 |
| reference-verify | 2 | 2 | 0 |
| setup | 31 | 30 | 1 |
| troubleshooting | 3 | 3 | 0 |

## docker-deploy

33. Exit 0: `scp -P 2221 sunbeam-source.tar sunbeam@127.0.0.1:/tmp/sunbeam-source.tar (dedicated lab key)` — output: 033-docker-deploy.txt
34. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'mkdir -p /home/sunbeam/app'` — output: 034-docker-deploy.txt
35. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'tar -xf /tmp/sunbeam-source.tar -C /home/sunbeam/app'` — output: 035-docker-deploy.txt
36. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker build --tag sunbeam:task1 /home/sunbeam/app'` — output: 036-docker-deploy.txt
37. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker volume create sunbeam-data'` — output: 037-docker-deploy.txt
38. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker run --detach --name sunbeam --restart unless-stopped --publish 3000:3000 --env DEMO_MODE=true --env APP_ORIGIN=http://localhost:8081 --mount type=volume,src=sunbeam-data,dst=/app/data sunbeam:task1'` — output: 038-docker-deploy.txt

## docker-fit

85. Exit 0: `scp viewport-fit source archive to IaaS` — output: 085-docker-fit.txt
86. Exit 0: `ssh IaaS: tar -xf /tmp/sunbeam-viewport-fit.tar -C /home/sunbeam/app` — output: 086-docker-fit.txt
87. Exit 0: `ssh IaaS: sudo docker build --tag sunbeam:viewport-fit /home/sunbeam/app` — output: 087-docker-fit.txt
88. Exit 0: `ssh IaaS: sudo docker stop sunbeam` — output: 088-docker-fit.txt
89. Exit 0: `ssh IaaS: sudo docker rename sunbeam sunbeam-reference-v1` — output: 089-docker-fit.txt
90. Exit 0: `ssh IaaS: sudo docker run --detach --name sunbeam --restart unless-stopped --publish 3000:3000 --env DEMO_MODE=true --env APP_ORIGIN=http://localhost:8081 --mount type=volume,src=sunbeam-data,dst=/app/data sunbeam:viewport-fit` — output: 090-docker-fit.txt

## docker-polish

68. Exit 0: `scp -P 2221 sunbeam-luxury-final.tar sunbeam@127.0.0.1:/tmp/sunbeam-luxury-final.tar` — output: 068-docker-polish.txt
69. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'tar -xf /tmp/sunbeam-luxury-final.tar -C /home/sunbeam/app'` — output: 069-docker-polish.txt
70. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker build --tag sunbeam:luxury-final /home/sunbeam/app'` — output: 070-docker-polish.txt
71. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker stop sunbeam'` — output: 071-docker-polish.txt
72. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker rename sunbeam sunbeam-color-v1'` — output: 072-docker-polish.txt
73. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker run --detach --name sunbeam --restart unless-stopped --publish 3000:3000 --env DEMO_MODE=true --env APP_ORIGIN=http://localhost:8081 --mount type=volume,src=sunbeam-data,dst=/app/data sunbeam:luxury-final'` — output: 073-docker-polish.txt

## docker-redesign

62. Exit 0: `scp -P 2221 sunbeam-luxury-source.tar sunbeam@127.0.0.1:/tmp/sunbeam-luxury-source.tar` — output: 062-docker-redesign.txt
63. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'tar -xf /tmp/sunbeam-luxury-source.tar -C /home/sunbeam/app'` — output: 063-docker-redesign.txt
64. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker build --tag sunbeam:luxury /home/sunbeam/app'` — output: 064-docker-redesign.txt
65. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker stop sunbeam'` — output: 065-docker-redesign.txt
66. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker rename sunbeam sunbeam-initial'` — output: 066-docker-redesign.txt
67. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker run --detach --name sunbeam --restart unless-stopped --publish 3000:3000 --env DEMO_MODE=true --env APP_ORIGIN=http://localhost:8081 --mount type=volume,src=sunbeam-data,dst=/app/data sunbeam:luxury'` — output: 067-docker-redesign.txt

## docker-reference

76. Exit 0: `scp -P 2221 sunbeam-reference-login.tar sunbeam@127.0.0.1:/tmp/sunbeam-reference-login.tar` — output: 076-docker-reference.txt
77. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'tar -xf /tmp/sunbeam-reference-login.tar -C /home/sunbeam/app'` — output: 077-docker-reference.txt
78. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker build --tag sunbeam:reference-login /home/sunbeam/app'` — output: 078-docker-reference.txt
79. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker stop sunbeam'` — output: 079-docker-reference.txt
80. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker rename sunbeam sunbeam-color-polished'` — output: 080-docker-reference.txt
81. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 'sudo docker run --detach --name sunbeam --restart unless-stopped --publish 3000:3000 --env DEMO_MODE=true --env APP_ORIGIN=http://localhost:8081 --mount type=volume,src=sunbeam-data,dst=/app/data sunbeam:reference-login'` — output: 081-docker-reference.txt

## docker-verify

39. Exit 0: `node scripts/verify-lab-app.mjs http://localhost:8081 --write` — output: 039-docker-verify.txt
40. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 sudo docker restart sunbeam` — output: 040-docker-verify.txt
41. Exit 0: `node scripts/verify-lab-app.mjs http://localhost:8081 --expect-persisted` — output: 041-docker-verify.txt

## dokku-deploy

48. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 'sudo dokku apps:create sunbeam'` — output: 048-dokku-deploy.txt
49. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 'sudo dokku builder:set sunbeam selected dockerfile'` — output: 049-dokku-deploy.txt
50. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 'sudo dokku storage:ensure-directory sunbeam'` — output: 050-dokku-deploy.txt
51. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 'sudo install -d -o 1000 -g 1000 -m 750 /var/lib/dokku/data/storage/sunbeam'` — output: 051-dokku-deploy.txt
52. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 'sudo dokku storage:mount sunbeam /var/lib/dokku/data/storage/sunbeam:/app/data'` — output: 052-dokku-deploy.txt
53. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 'sudo dokku config:set --no-restart sunbeam NODE_ENV=production DEMO_MODE=true HOST=0.0.0.0 PORT=3000 DATA_DIR=/app/data APP_ORIGIN=http://localhost:8082 SECURE_COOKIE=false'` — output: 053-dokku-deploy.txt
54. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 'sudo dokku domains:set sunbeam localhost'` — output: 054-dokku-deploy.txt
55. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 'sudo dokku ports:set sunbeam http:80:3000'` — output: 055-dokku-deploy.txt
56. Exit 0: `git remote add dokku-lab ssh://dokku@127.0.0.1:2222/sunbeam` — output: 056-dokku-deploy.txt
57. Exit 0: `git -c core.sshCommand="<dedicated local lab key and known_hosts>" push dokku-lab HEAD:main` — output: 057-dokku-deploy.txt

## dokku-fit

84. Exit 0: `git push dokku-lab HEAD:main (ed770e6 viewport fit)` — output: 084-dokku-fit.txt

## dokku-redesign

61. Exit 0: `git -c core.sshCommand="<dedicated local lab key>" push dokku-lab HEAD:main (redesign d1d06d4)` — output: 061-dokku-redesign.txt

## dokku-verify

58. Exit 0: `node scripts/verify-lab-app.mjs http://localhost:8082 --write` — output: 058-dokku-verify.txt
59. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 sudo dokku ps:restart sunbeam` — output: 059-dokku-verify.txt
60. Exit 0: `node scripts/verify-lab-app.mjs http://localhost:8082 --expect-persisted` — output: 060-dokku-verify.txt

## fit-verify

91. Exit 0: `node scripts/verify-lab-app.mjs http://localhost:8082 --expect-persisted` — output: 091-fit-verify.txt
92. Exit 0: `node scripts/verify-lab-app.mjs http://localhost:8081 --expect-persisted` — output: 092-fit-verify.txt

## login-reference

75. Exit 0: `git -c core.sshCommand="<dedicated local lab key>" push dokku-lab HEAD:main (reference login 55d6837)` — output: 075-login-reference.txt

## platform-evidence

42. Exit 0: `VBoxManage list runningvms` — output: 042-platform-evidence.txt
43. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 sudo docker ps --filter name=sunbeam` — output: 043-platform-evidence.txt
44. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 sudo docker exec sunbeam node --version` — output: 044-platform-evidence.txt
47. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 dokku version` — output: 047-platform-evidence.txt

## redesign-verify

74. Exit 0: `node scripts/verify-lab-app.mjs http://localhost:8081 --expect-persisted (final design)` — output: 074-redesign-verify.txt

## reference-verify

82. Exit 0: `node scripts/verify-lab-app.mjs http://localhost:8081 --expect-persisted (reference login)` — output: 082-reference-verify.txt
83. Exit 0: `node scripts/verify-lab-app.mjs http://localhost:8082 --expect-persisted (reference login)` — output: 083-reference-verify.txt

## setup

1. Exit 0: `VBoxManage --version` — output: 001-setup.txt
2. Exit 0: `VBoxManage list hostinfo` — output: 002-setup.txt
3. Exit 0: `VBoxManage createvm --name sunbeam-iaas --ostype Ubuntu_64 --basefolder C:\Users\young\SunbeamLab\vms --register` — output: 003-setup.txt
4. Exit 0: `VBoxManage modifyvm sunbeam-iaas --memory 2048 --cpus 2 --ioapic on --nic1 nat --natpf1 ssh,tcp,127.0.0.1,2221,,22 --natpf1 app,tcp,127.0.0.1,8081,,3000` — output: 004-setup.txt
5. Exit 0: `VBoxManage startvm sunbeam-iaas --type headless (host virtualization preflight, disk not yet attached)` — output: 005-setup.txt
6. Exit 0: `VBoxManage controlvm sunbeam-iaas poweroff (empty preflight VM)` — output: 006-setup.txt
7. Exit 0: `VBoxManage createvm --name sunbeam-paas --ostype Ubuntu_64 --basefolder C:\Users\young\SunbeamLab\vms --register` — output: 007-setup.txt
8. Exit 0: `VBoxManage modifyvm sunbeam-paas --memory 2048 --cpus 2 --ioapic on --nic1 nat --natpf1 ssh,tcp,127.0.0.1,2222,,22 --natpf1 app,tcp,127.0.0.1,8082,,80` — output: 008-setup.txt
9. Exit 0: `VBoxManage storagectl sunbeam-iaas --name SATA --add sata --controller IntelAhci` — output: 009-setup.txt
10. Exit 0: `VBoxManage storageattach sunbeam-iaas --storagectl SATA --port 1 --device 0 --type dvddrive --medium iaas-seed.iso` — output: 010-setup.txt
11. Exit 0: `VBoxManage storagectl sunbeam-paas --name SATA --add sata --controller IntelAhci` — output: 011-setup.txt
12. Exit 0: `VBoxManage storageattach sunbeam-paas --storagectl SATA --port 1 --device 0 --type dvddrive --medium paas-seed.iso` — output: 012-setup.txt
13. Exit 0: `tar -xf C:\Users\young\SunbeamLab\downloads\noble-server-cloudimg-amd64.ova -C C:\Users\young\SunbeamLab\ubuntu-image` — output: 013-setup.txt
14. Exit 0: `VBoxManage clonemedium disk C:\Users\young\SunbeamLab\ubuntu-image\ubuntu-noble-24.04-cloudimg.vmdk C:\Users\young\SunbeamLab\vms\sunbeam-iaas\sunbeam-iaas.vdi --format VDI` — output: 014-setup.txt
15. Exit 0: `VBoxManage modifymedium disk C:\Users\young\SunbeamLab\vms\sunbeam-iaas\sunbeam-iaas.vdi --resize 20480` — output: 015-setup.txt
16. Exit 0: `VBoxManage storageattach sunbeam-iaas --storagectl SATA --port 0 --device 0 --type hdd --medium C:\Users\young\SunbeamLab\vms\sunbeam-iaas\sunbeam-iaas.vdi` — output: 016-setup.txt
17. Exit 0: `VBoxManage modifyvm sunbeam-iaas --boot1 disk --boot2 dvd --boot3 none --boot4 none --graphicscontroller vmsvga` — output: 017-setup.txt
18. Exit 0: `VBoxManage startvm sunbeam-iaas --type headless` — output: 018-setup.txt
19. Exit 0: `VBoxManage clonemedium disk C:\Users\young\SunbeamLab\ubuntu-image\ubuntu-noble-24.04-cloudimg.vmdk C:\Users\young\SunbeamLab\vms\sunbeam-paas\sunbeam-paas.vdi --format VDI` — output: 019-setup.txt
20. Exit 0: `VBoxManage modifymedium disk C:\Users\young\SunbeamLab\vms\sunbeam-paas\sunbeam-paas.vdi --resize 20480` — output: 020-setup.txt
21. Exit 0: `VBoxManage storageattach sunbeam-paas --storagectl SATA --port 0 --device 0 --type hdd --medium C:\Users\young\SunbeamLab\vms\sunbeam-paas\sunbeam-paas.vdi` — output: 021-setup.txt
22. Exit 0: `VBoxManage modifyvm sunbeam-paas --boot1 disk --boot2 dvd --boot3 none --boot4 none --graphicscontroller vmsvga` — output: 022-setup.txt
23. Exit 0: `VBoxManage startvm sunbeam-paas --type headless` — output: 023-setup.txt
27. Exit : `ssh -p 2222 sunbeam@127.0.0.1 cloud-init status --wait` — output: 
28. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 cloud-init status --wait` — output: 028-setup.txt
29. Exit 0: `scp -P 2222 dokku-bootstrap.sh sunbeam@127.0.0.1:/home/sunbeam/dokku-bootstrap.sh` — output: 029-setup.txt
30. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 sudo env DOKKU_TAG=v0.38.31 DOKKU_HOSTNAME=localhost DOKKU_SKIP_KEY_FILE=true bash /home/sunbeam/dokku-bootstrap.sh` — output: 030-setup.txt
31. Exit 0: `scp -P 2221 scripts/install-docker-guest.sh sunbeam@127.0.0.1:/home/sunbeam/install-docker-guest.sh` — output: 031-setup.txt
32. Exit 0: `ssh -p 2221 sunbeam@127.0.0.1 sudo bash /home/sunbeam/install-docker-guest.sh` — output: 032-setup.txt
45. Exit 0: `scp -P 2222 id_ed25519.pub sunbeam@127.0.0.1:/tmp/sunbeam-lab.pub (public key only)` — output: 045-setup.txt
46. Exit 0: `ssh -p 2222 sunbeam@127.0.0.1 sudo dokku ssh-keys:add sunbeam-lab /tmp/sunbeam-lab.pub` — output: 046-setup.txt

## troubleshooting

24. Exit 0: `VBoxManage controlvm sunbeam-iaas acpipowerbutton (request clean shutdown for serial logging)` — output: 024-troubleshooting.txt
25. Exit 0: `VBoxManage modifyvm sunbeam-iaas --uart1 0x3F8 4 --uartmode1 file C:\Users\young\SunbeamLab\iaas-serial.log` — output: 025-troubleshooting.txt
26. Exit 0: `VBoxManage startvm sunbeam-iaas --type headless (capture boot log)` — output: 026-troubleshooting.txt
