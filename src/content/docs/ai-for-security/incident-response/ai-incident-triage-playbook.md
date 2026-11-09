---
title: "AI Security Incident Triage & Forensic Playbook"
description: "Standard operating procedure for detecting, triaging, containing, and analyzing security incidents in AI systems."
tags: ["Incident-Response", "AI-Forensics", "Auditability", "Triage", "Post-Mortem"]
threat_level: "High"
date: 2026-03-31
draft: false
---

## Overview

Responding to security incidents in AI-enabled applications differs fundamentally from traditional cyber incident response. Because generative models are non-deterministic and can generate plausible yet erroneous or exfiltrative behaviors, incident triage requires specialized telemetry, prompt-replay sandboxes, model weight provenance tracking, and semantic blast-radius assessment.

---

## 4-Phase Incident Response Lifecycle

```
[Phase 1: Detection & Alerting]
             |
             v
[Phase 2: Rapid Containment & Kill-Switches]
             |
             v
[Phase 3: Forensic Extraction & Root-Cause Triage]
             |
             v
[Phase 4: Eradication, Post-Mortem & Policy Hardening]
```

---

## Step-by-Step Triage Workflow

### Phase 1: Detection & Alerting
- Correlate anomalous token consumption spikes, guardrail violation spikes, or repeated tool invocation failures.
- Ingest real-time alerts from WAFs, semantic monitoring proxies, and downstream DLP (Data Loss Prevention) sensors.

### Phase 2: Rapid Containment
- **Trigger Tiered Kill-Switches:**
  - *Tier 1 (Fallback Mode):* Disable autonomous tool invocation and fall back to strictly deterministic, pre-approved responses.
  - *Tier 2 (Gateway Throttling):* Sever connection to downstream agentic connectors or external MCP servers.
  - *Tier 3 (Full Quarantine):* Revoke session credentials and redirect inbound traffic to a static maintenance endpoint.

### Phase 3: Forensic Extraction & Evidence Preservation
- **Preserve Non-Volatile Context:** Archive complete conversation logs, prompt context windows, raw temperature/seed settings, retrieval chunk IDs, and model checkpoints.
- **Isolate Deterministic vs Stochastic Factors:** Replay the offensive input string in an isolated sandbox with fixed random seed ($\tau = 0$) to verify reproducibility.
- **Assess Semantic Blast Radius:** Determine if poisoned RAG chunks or corrupted vector embeddings affected other concurrent user sessions.

### Phase 4: Post-Mortem & Remediation
- Publish a blameless post-mortem document detailing the initial vector, failure mechanism, and time-to-containment.
- Update red-teaming test suites and automated continuous evaluation regression suites to prevent future recurrence.
