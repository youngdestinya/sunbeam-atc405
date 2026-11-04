# Your Sunbeam walkthrough estate

Student AGL202607071 · D=1 · Small tier · assigned feeder suffix 1 · Task 4 six-hour South African region outage.

## Open the two deployments

| Estate | Guest | App address | SSH forwarding |
|---|---|---|---|
| Docker / infrastructure you operate | sunbeam-iaas · Ubuntu 24.04.5 · 2 CPUs · 2 GB RAM | http://localhost:8081 | 127.0.0.1:2221 → guest 22 |
| Self-hosted Dokku platform | sunbeam-paas · Ubuntu 24.04.5 · 2 CPUs · 2 GB RAM | http://localhost:8082 | 127.0.0.1:2222 → guest 22 |

Both disks are dynamically allocated with a 20 GB virtual capacity. VirtualBox is 7.2.22r175245; Docker Engine is 29.9.3; Dokku is 0.38.31. The Docker application reports Node.js v24.22.2. Actual outputs and source revision are in `lab-evidence/`.

The lab uses fictional records and the documented local demo logins. Both browser endpoints are forwarded only on 127.0.0.1 through NAT. No public domain, cloud server, Docker Desktop, WSL distribution or paid extension pack was provisioned. These VMs model responsibilities for the assignment; they are not a production deployment for 200,000 meters.

Click **Field officer**, then **Sign in securely**. Use **Billing reviewer** for the other role. Sign in again if switching between the local deployments invalidates the other tab's session: the current teaching app uses the same localhost cookie name on both ports.

## Show the command counts in your recording

Open PowerShell in the project folder and run:

```powershell
./scripts/show-walkthrough-evidence.ps1
```

This is a read-only evidence view: it lists the running VMs, reads the actual deployment ledger and checks both health URLs. It does not reinstall or redeploy the app. Show its output, then show the two working browser tabs. For the installation/deployment detail, open `docs/lab-evidence/COMMAND-COUNTS.md` and the referenced numbered output files.

Count initial application deployment invocations, including source transfer/configuration. Keep prerequisite setup, troubleshooting, installation-script internals and verification separate. Each verifier is one entered command that runs multiple HTTP assertions. Do not describe that as one HTTP request or include only successful attempts while hiding failures. The original runbook's template counts do not replace this actual ledger.

## Use this recording order

1. First 30 seconds on camera: identify the field officer and the three decisions.
2. Show VirtualBox Manager with `sunbeam-iaas` and `sunbeam-paas` running. No changes were made to the pre-existing Samsung VM entry.
3. Show the evidence script and Docker's recorded deployment count. Open http://localhost:8081 and inspect a visit.
4. Show Dokku's count, its Git-push deployment output and http://localhost:8082. Briefly explain the separate human review route.
5. Explain that Docker packages the app; operating the VM and Docker is still Sunbeam's work. Dokku provides a PaaS-style workflow, but this self-hosted lab leaves Sunbeam operating Dokku and its host. A managed PaaS would transfer more infrastructure work to the provider.
6. Last 30 seconds on camera: refuse to move the identity mapping/key from controlled infrastructure in Abeokuta, explain customer privacy and refuse automated disconnection.

The full timed narration remains in `docs/walkthrough-script.md`. Read the architecture pack before recording; the proposed readings pipeline and identity vault are not implemented by these local demo VMs.

## Stop or resume the estate

```powershell
# Read current state.
./scripts/lab-estate.ps1 -Action Status
# Request clean guest shutdowns after recording.
./scripts/lab-estate.ps1 -Action Stop
# Start the two guests for another session; allow them time to boot.
./scripts/lab-estate.ps1 -Action Start
```

The Stop action requests ACPI shutdown rather than forcing power off. Wait until VirtualBox shows Powered Off before shutting down the host. Application records are on persistent volumes. Docker container and Dokku process restarts are tested separately in the verification evidence; a full Windows reboot/restore drill is not claimed.

If a guest is running but the app hasn't resumed, inspect it using the dedicated lab SSH helper:

```powershell
. ./scripts/lab-ssh.ps1
$labArgs = Get-LabSshArguments -Port 2222 -Command 'sudo dokku ps:report sunbeam'
ssh @labArgs
# If the report shows the app stopped, start it deliberately:
$labArgs = Get-LabSshArguments -Port 2222 -Command 'sudo dokku ps:start sunbeam'
ssh @labArgs
```

Keep `C:\Users\young\SunbeamLab`: it contains the VM disks, NoCloud seed ISOs, installers and dedicated SSH key. These large disks and private key are deliberately outside Google Drive and the source repository. Do not publish the private key or delete the lab folder while the VMs are registered.

## Evidence limits

The installation used Oracle's checksum-verified, signed base installer and Ubuntu's checksum-verified cloud image. Windows hypervisor/security features were left enabled; no host reboot was required. Initial SSH probes timed out during first boot, then the guests initialized successfully. Serial logging was enabled on the IaaS guest to inspect boot messages. The raw ledger retains an instrumentation failure with missing exit status; see `instrumentation-note.txt`.

VirtualBox's GUI was launched. Computer Use continued to deny access to its window even after permission was reported enabled, so no automated console screenshot is claimed. Running-state evidence is recorded using VBoxManage; inspect the actual Manager window yourself when recording.
