# Deployment and operational runbook

Student AGL202607071 · D=1 · Small tier · feeder suffix 1 · Task 4 six-hour South African regional outage.

## Command-count convention

Count each shell invocation typed after prerequisites are ready, including configuration. Do not count automatic Dockerfile build steps or commands you have not run. Keep a transcript and report your actual number. The Docker model below has **3 invocations after the initial source checkout**; Dokku Dockerfile has **12** including volume ownership, application configuration and verification. Installation, SSH setup, VM creation, DNS, TLS, Git initialization and secrets generation are extra and must be counted separately if shown. Never describe these template counts as measured execution evidence.

## A. Local Node baseline

Prerequisite: Node.js 24+. From the project folder, `npm start`. Visit http://localhost:3000 and verify `/healthz`. No dependency installation is needed. Use `npm test` for isolated API tests. Local mode enables synthetic demo credentials.

## B. Docker container — 3 baseline invocations

Prerequisites: Docker Engine or Docker Desktop running with Linux containers; source folder available. Create `.env` with distinct passwords of at least 16 characters. The supplied `.env.example` contains invalid placeholders intentionally.

1. `Copy-Item .env.example .env` — edit its passwords, origin and cookie setting in an editor. Record editing/configuration separately in the walkthrough.
2. `docker compose up --build -d`
3. `Invoke-RestMethod http://localhost:3000/healthz`

Open http://localhost:3000. Login uses your configured passwords, and demo-fill buttons disappear. Docker binds the application to 0.0.0.0 inside the container but publishes it only to loopback on the host. Compose stores the database in the named `sunbeam-data` volume. `docker compose down` preserves it; **do not use `down -v`** unless deliberately deleting the data.

Production access requires a TLS reverse proxy on the host. Set `APP_ORIGIN=https://your-domain` and `SECURE_COOKIE=true`; keep port 3000 private. Apply firewall rules and use an approved credential manager. This Compose setup is not itself a public HTTPS deployment.

## C. Dokku — Dockerfile deployment (12 baseline invocations)

Prerequisites: Linux host with supported Dokku installed; Git repository committed locally; SSH authorized; domain and DNS under your control. Run server commands through the Dokku host's SSH terminal; Git commands run locally. Substitute your own host/domain and fresh secrets. Password values below are placeholders, not valid credentials.

```bash
# On the Dokku host (commands 1–8)
dokku apps:create sunbeam
dokku builder:set sunbeam selected dockerfile
dokku storage:ensure-directory sunbeam
sudo install -d -o 1000 -g 1000 -m 750 /var/lib/dokku/data/storage/sunbeam
dokku storage:mount sunbeam /var/lib/dokku/data/storage/sunbeam:/app/data
dokku config:set --no-restart sunbeam NODE_ENV=production DEMO_MODE=false HOST=0.0.0.0 PORT=3000 DATA_DIR=/app/data APP_ORIGIN=https://sunbeam.example.org SECURE_COOKIE=true FIELD_PASSWORD='<unique-secret-at-least-16-chars>' REVIEW_PASSWORD='<different-secret-at-least-16-chars>'
dokku domains:set sunbeam sunbeam.example.org
dokku ports:set sunbeam http:80:3000
# Locally (commands 9–10)
git remote add dokku dokku@YOUR_HOST:sunbeam
git push dokku HEAD:main
# On host (command 11)
dokku ps:report sunbeam
# Locally (command 12)
curl https://sunbeam.example.org/healthz
```

The final HTTPS check succeeds only after TLS is configured. Install/configure Dokku's supported certificate tooling and issue a certificate for the real domain; those commands are additional to the baseline count. Set `APP_ORIGIN` to the actual domain in command 6, not an example domain. If demonstrating HTTP on an isolated VM, set its exact `http://...` origin and `SECURE_COOKIE=false`, then do not expose it to the public internet.

The container uses the `node` user (UID 1000 in this image). Verify mounted directory ownership allows that UID to write. Dokku storage defaults and host permissions can differ; correct only this application's storage directory after inspecting its resolved path. Run `dokku logs sunbeam` to inspect failures. Confirm the database persists across `dokku ps:restart sunbeam`.

### Procfile / buildpack alternative

The repository also contains `Procfile` for a Node buildpack deployment. The default Dokku path above deliberately uses Dockerfile. To demonstrate Procfile instead, choose a Node buildpack supported by your installed Dokku version, disable Dockerfile detection with its documented buildpack selection, set `HOST`, `PORT`, `DATA_DIR` and credentials, mount a writable persistent directory at the configured `DATA_DIR`, then push the source. Verify Node >=24. Do not claim that the Dockerfile path exercised the Procfile. Record the buildpack identifier, Node version, actual commands and successful output in your walkthrough.

## D. VirtualBox estate

VirtualBox is not provisioned by these files. On a host with hardware virtualization enabled:

1. Create two Linux VMs if resources permit: `sunbeam-iaas` for the Docker demonstration and `sunbeam-paas` for Dokku. A suggested teaching baseline is 2 vCPU/4 GB RAM each; tune to host capacity. This is not production sizing.
2. Use NAT with only the needed SSH/HTTP forwarded ports, or a controlled host-only network. Record guest IPs and host forwarding ports; do not accidentally expose demo credentials.
3. Install a supported Linux distribution, updates and guest tools; snapshot the clean baseline.
4. Install Docker on the IaaS VM and Dokku on the PaaS VM using their current official instructions. Review prerequisites first.
5. Copy or clone source to each appropriate host. Apply the two deployment paths. Use different browser origins if ports differ.
6. Show VirtualBox Manager with the machines running, then each deployed app and its health result. Record versions and command counts from execution.

Stretch faasd is optional and not implemented. Do not add operational complexity without demonstrating why it serves one of the three decisions.

## Backup, recovery and monitoring

- Back up SQLite with its online backup API or stop the app briefly and copy the database while quiescent. Do not copy only the main SQLite file during WAL writes. Encrypt backups and restrict access.
- For a local consistent backup while stopped: stop Node; copy the entire `data/` directory to a protected backup location; restart. For containers, use a backup process able to read the volume; never publish the volume as a static directory.
- Restore into a separate test directory/volume, start a test app on a different port, verify reports and appeals, then record restore time. Recovery targets are unproven until this is done.
- Monitor process health and database errors, volume capacity, failed logins, queue age in the future pipeline, and event-to-alert timing. An HTTP health check does not prove data freshness.
- For the Task 4 six-hour South African outage: retain Nigerian operational alerts and identity service independently, queue analytics exports, show stale status, pause evidence-dependent billing, prohibit automatic disconnection and replay/reconcile on recovery. These are architecture proposals, not delivered cloud failover.

## Recording evidence

Use `docs/walkthrough-script.md`. Capture commands and successful output, not just this documentation. Do not expose secrets in the recording. Required evidence includes running VirtualBox estate, app under Docker and Dokku, actual command counts, service-model reasoning and the retained identity-key workload.
