# Actual lab evidence

Student AGL202607071 · D=1 · Small tier · feeder suffix 1.

This directory records the real setup/deployment attempt begun on 4 November 2026. It is separate from the illustrative command counts in the original runbook.

`commands.jsonl` records one entry per executed native invocation through `Invoke-LabCommand`, including failures. Each output file has the same sequence number. SSH invocations containing one compound remote shell command are recorded as one invocation; the full remote command is visible in its label. Setup, Docker deployment, Dokku deployment and verification are separate phases. Bootstrap scripts perform internal commands; these are not misrepresented as manual invocations and must be disclosed during the comparison.

Initial preflight: Windows host has Intel i7-12700, 32 GB RAM, about 61 GB free disk and an active Windows hypervisor. About 7.5 GB RAM was free during the check. No VirtualBox, Docker, Dokku or installed WSL distribution was detected. This shell is not elevated. Hypervisor presence can mask the firmware virtualization fields; those false fields alone are not a diagnosis of disabled BIOS virtualization.

Host installation attempt: `winget install --id Oracle.VirtualBox --exact --source winget --silent --disable-interactivity --log C:\Users\young\SunbeamLab\virtualbox-install.log`. Winget's Delivery Optimization download remained at zero bytes, so the owned winget process was stopped and a direct official Oracle download was started. This failed setup attempt is excluded from application-deployment counts and retained here for transparency.

Virtual machine disks, installers and private SSH material are kept in `C:\Users\young\SunbeamLab`, outside Google Drive and outside this repository. VM network adapters must use NAT with host forwarding bound to 127.0.0.1. No public hosting or paid cloud resource is requested.

Visual revisions are recorded in separate deployment phases; they do not alter the original Docker 6 / Dokku 10 initial-deployment comparison. For successful commands that emitted no text, their output file explicitly states that no stdout/stderr was captured. Sequence 27 remains the separately documented instrumentation error.
