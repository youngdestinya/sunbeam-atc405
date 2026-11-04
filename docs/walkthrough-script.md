# Three-minute walkthrough script

Student AGL202607071; D=1; Small scale; feeder identifiers ending in 1; Task 4 six-hour South African region outage.

**0:00–0:30, on camera:** “My primary user is Sunbeam's field revenue officer, assigned to feeder 1 and working on a phone. The platform supports three decisions: which feeders to inspect this month, whether a feeder outage needs action within fifteen minutes, and whether estimated billing is justified and a disconnection can be reviewed. My student digit is 1, so my scale tier is Small.”

**0:30–1:00, screen:** Show VirtualBox Manager with sunbeam-iaas and sunbeam-paas running. “These are my two Ubuntu 24.04.5 guests under VirtualBox 7.2.22. Each has two CPUs and two gigabytes of RAM. The IaaS-style estate leaves Sunbeam responsible for the guest OS, patches, networking, runtime and backups.”

**1:00–1:35, screen:** Show Docker deployment command output and the app. Sign in as field officer, inspect feeder 1, save a report and show persistence. “The initial Docker deployment took six entered commands after the VM, Docker Engine and committed source were ready. Installation and three verification commands are counted separately. Packaging is repeatable, but Sunbeam still operates its host and container runtime.”

**1:35–2:10, screen:** Show Dokku deployment output and app health. “The initial Dokku deployment took ten entered commands, including app configuration and the Git push. Installation and three verification commands are separate. Dokku provides a PaaS-style developer interface; because this estate is self-hosted, Sunbeam still operates Dokku and the underlying VM. A managed PaaS would transfer more of that responsibility to its provider.” Briefly show billing appeal and separate reviewer if time allows.

**2:10–2:30, screen:** Show the architecture pack. “I choose managed PaaS ingestion and transformations for 19.2 million readings a day because three engineers cannot justify a bespoke distributed platform. Managed storage/querying serves monthly loss analysis. Outage processing stays independent of the foreign analytics lake. SaaS identity and support tooling can reduce undifferentiated operations. Field evidence remains subject to human review.”

**2:30–3:00, on camera:** “I refuse to move the identity re-identification key out of Sunbeam-controlled infrastructure in Abeokuta. Pseudonymized readings are still personal data, and foreign hosting needs a lawful, documented transfer position. I also refuse automated disconnection and guilt labels. During my six-hour region-outage scenario, we preserve operational alerts, pause evidence-dependent billing and reconcile records after recovery.”

Record honest limitations. The local VirtualBox, Docker and Dokku runs are now evidenced in docs/lab-evidence. The cloud pipeline, trained model and faasd remain unimplemented and must not be claimed. Upload and repository destinations were not provided.

The later visual-design rollouts appear as separate phases in the ledger. Quote the original first-deployment counts (Docker 6, Dokku 10) and identify this counting boundary in the recording.
