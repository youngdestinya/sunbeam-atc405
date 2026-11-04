# Architecture decisions

Student: AGL202607071. D=1. Small tier: 200,000 meters / 500 feeders. Assigned feeder identifiers end in 1 (feeder 1 in the practical). Task 4 incident: South African region unavailable for six hours during billing.

## ADR-01 — Managed PaaS for the readings pipeline
Status: proposed architecture, accepted for this submission; cloud resources not provisioned.

Context: 200,000 meters × 96 readings/day = 19.2 million readings/day, about 222/second on average before burst headroom. Daily reconciliation and monthly loss analysis already produce value. Three engineers, including one data engineer, cannot reasonably operate a bespoke distributed cluster. A fifteen-minute outage requirement cannot depend on the nightly lake copy.

Decision: use managed ingestion, queueing, scheduled transformations and SQL querying (PaaS), with managed object storage for the pseudonymized South African lake. Keep event-time outage processing operationally separate in Nigeria, subject to verified provider availability. Use a durable queue, replayable object partitions, idempotency keys (meter, event timestamp, event type), dead-letter handling and quality gates for units, duplicate events, late arrivals and feeder mapping. Do not introduce self-managed Kubernetes, Kafka clusters or a data warehouse without a measured need.

Alternatives: IaaS provides control but makes Sunbeam responsible for operating system patching, availability and orchestration. FaaS can suit small transformations but does not by itself solve state, replay or late-event handling. SaaS reporting cannot replace the custom reconciliation logic and field assignment policy. Docker and Dokku demonstrate different operating responsibilities for the web app; neither is proof of a managed cloud readings pipeline.

Consequences: less infrastructure work, variable provider costs and some lock-in. Sunbeam still owns lawful purpose, transfer safeguards, schema, access, data quality, retention, pipeline code, alerts and recovery validation. Budget USD costs in NGN and stress year 2: if one naira buys 30% fewer dollars, NGN/USD rises by 1/0.7 (42.86%), not merely 30%. Task 2 must state this interpretation and verify provider quotes.

Success criteria: prove ingest/replay correctness under burst load and operational alert latency from event time, including network delay. Missing evidence must delay billing decisions instead of generating plausible values. No production performance claim is made by this small app.

## ADR-02 — Retain the identity mapping key on controlled infrastructure in Abeokuta
Status: accepted architecture decision; identity vault not implemented in this teaching app.

Context: linking fifteen-minute consumption to identities can reveal household routines. Pseudonymization is reversible and does not anonymize consumption. Copying the re-identification key alongside the foreign-hosted lake would defeat the separation.

Decision: refuse to move the code-to-customer identity mapping and its re-identification keys into the South African analytics estate. Keep an encrypted, access-controlled service on Sunbeam-controlled infrastructure in Abeokuta; separate administration from analysts, restrict network access, log retrievals, test encrypted backups and authorize re-identification only for an approved case. Field officers receive the minimum permitted visit detail for their assigned feeders. This demo holds synthetic references only and cannot re-identify anyone.

Alternatives: a foreign-hosted identity store simplifies integration but concentrates risk; storing raw names in readings is rejected. An approved Nigerian managed vault could be assessed later, but location alone does not establish control, lawful processing or safety.

Consequences: Sunbeam retains physical security, OS patching, vault operations, backup and recovery responsibilities. Reserve operating time among the three engineers and document ownership. There is no platform engineer. A managed endpoint elsewhere must not silently bypass this decision.

Task 4 resilience position: operational alerts should not require the South African lake. During its six-hour outage, retain queued records, display freshness, pause evidence-dependent billing, avoid automatic disconnection, then replay idempotently and reconcile. Recovery targets remain proposals until exercised.
