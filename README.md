# Sunbeam — Field Operations

ATC 405 Cloud Infrastructure and Databases · Task 1

**Student:** AGL202607071 · **D:** 1 · **Scale:** Small (200,000 meters, 500 feeders) · **Assigned feeders:** identifiers ending in 1; practical feeder 1 · **Task 4 incident:** South African region unreachable for six hours during billing.

A navy-and-gold, phone-friendly application using locally bundled **Alegreya Sans**. It demonstrates assigned field visits, persistent evidence reports, billing appeals, separate human review, outage timing evidence and a bounded help assistant. All seeded records are fictional.

## Your completed local VirtualBox lab

The app has been deployed on two separate Ubuntu guests: **Docker at http://localhost:8081** and **Dokku at http://localhost:8082**. See [docs/LAB-GUIDE.md](docs/LAB-GUIDE.md) for recording, starting and stopping the estate, and [the actual command ledger](docs/lab-evidence/COMMAND-COUNTS.md) for executed commands. The Node-only option below remains available.

## 1. Run locally

Install Node.js 24 or newer. No npm dependencies, account or paid service is required.

```powershell
cd "C:\Users\young\My Drive\AB\AOU Nigeria\ATC 405"
npm start
```

Open http://localhost:3000. Keep the terminal running. Press Ctrl+C to stop. The SQLite database is created automatically under `data/`; reopening preserves reports and appeals. Sessions expire after eight hours and are lost on restart.

For another port, set both `PORT` and `APP_ORIGIN`; the origin must exactly match the browser address for form submissions.

```powershell
$env:PORT='3100'
$env:APP_ORIGIN='http://localhost:3100'
npm start
```

## 2. Sign in

Local development enables demonstration credentials. Click a role button to fill the credentials, then click **Sign in securely**.

| Role | Username | Local demo password |
|---|---|---|
| Field revenue officer | field | SunbeamField!2026 |
| Billing dispute officer | reviewer | SunbeamReview!2026 |

Any public or real-customer deployment must disable demo mode and supply distinct passwords of at least 16 characters. The loopback-only VirtualBox teaching lab intentionally enables demo mode with fictional records. Never reuse the local demo passwords publicly. The application remains a teaching deployment even with demo credentials disabled.

## 3. Plan a field visit

1. Sign in as `field`.
2. On **Overview**, review assigned feeder 1, remaining visits and the energy gap.
3. Select **Open visit queue** or **Field visits**.
4. Search by synthetic customer reference or evidence type; filter by visit status.
5. Click **Review visit** for SB-101.
6. Read the evidence. A mapping mismatch or consumption anomaly is a reason to inspect, not a finding of theft.
7. Choose a finding and enter at least ten characters of factual evidence. Avoid names, phone numbers and addresses.
8. Click **Save visit report**. The status updates and is stored in SQLite. Revisit the customer to see the saved evidence history.

## 4. Examine an outage

1. Open **Outage watch**.
2. Compare the event time (08:59), receipt (09:03) and alert creation (09:04), all WAT.
3. Explain the five-minute event-to-alert interval and the pending controller verification.
4. Note that late burst arrivals can mislead an arrival-time-only system. This is a fixed synthetic event, not a running ingestion service or proven SLA.

## 5. Submit and review a billing appeal

1. As `field`, open **Billing & appeals** → **Open customer appeal**.
2. Choose SB-103, the estimated-bill case. Explain the missing evidence or disputed bill.
3. Click **Submit for human review**. The pending appeal appears immediately.
4. Click **Lock & sign out**.
5. Sign in as `reviewer`; open **Billing & appeals**.
6. Select **Review appeal**, choose **Correction requested** or **More evidence required**, and enter a reasoned decision.
7. Click **Save human review**. The field officer can later see the outcome.
8. Open **Platform guide** → **Inspect audit history** to see server-recorded actions. The field role cannot access that endpoint.

There is no disconnection action. This internal workflow does not submit a complaint to NERC or decide the legal validity of a real bill.

## 6. Use the help assistant

Open **Help assistant**. Ask “How should I handle an estimated bill?”, “How is the outage timed?” or “Where is the identity key?”. The assistant uses explicit policy rules and makes no external AI calls. It refuses requests to label a customer guilty or authorize disconnection. It is not a trained model or the final Task 4 AI deliverable.

## 7. Deploy and verify

Follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Docker, Dokku, VirtualBox, persistent storage, HTTPS, backups and exact command-count conventions. Run `npm test` before deployment. Verify `/healthz`, both roles and persistence after restart on the target host.

## 8. Prepare the assignment submission

| Artifact | Purpose |
|---|---|
| `docs/architecture-pack.html` | Two designed A4 pages: three required tables and two ADR summaries; print to PDF at 100%, browser headers/footers off |
| `decisions.md` | Full ADR-01 and ADR-02 |
| `docs/DOCUMENTATION.md` | Application architecture, API, data, responsibilities and limitations |
| `docs/DEPLOYMENT.md` | Deployment instructions and recording plan |
| `docs/walkthrough-script.md` | Three-minute recording script with actual-evidence placeholders |
| `config/dataset-settings.json` | Required practical dataset settings; generated data excluded |
| `Dockerfile`, `Procfile`, `compose.yaml` | Container and platform deployment artifacts |
| `docs/VERIFICATION.md` | Results and outstanding environment-dependent checks |

The local Git repository is initialized, and the deployed application source is commit 1ba37c2. Dokku receives that source through the local dokku-lab Git remote. Additional lab evidence is kept in docs/lab-evidence. No GitHub repository or external submission is claimed. Do not commit `.env`, `data/` or generated meter readings.

## Troubleshooting

- **Request origin is not allowed:** use the exact address in `APP_ORIGIN`; localhost and 127.0.0.1 differ.
- **Port already in use:** stop the earlier server or configure another port and origin.
- **Missing `node:sqlite`:** use Node.js 24+; older Node versions are unsupported.
- **Container runs but browser cannot connect:** ensure `HOST=0.0.0.0` inside the container and published port 3000.
- **Cannot sign in after restart:** sessions are intentionally cleared. Sign in again.
- **Too many attempts:** wait 15 minutes after ten failed attempts. Restarting also clears the in-memory limiter; use edge rate limiting for real deployment.
- **Data disappeared:** ensure `/app/data` is mounted persistently and backed up; changing `DATA_DIR` selects another database.
- **No Docker/VirtualBox/Dokku installed:** local Node runs still work. Install deployment tools on a suitable host and record actual execution; files alone do not prove deployment.
