# AI & AI Security Knowledge Hub

A high-performance documentation portal centered on **AI & AI Security**, structured into 3 core themes with folder-driven nested subthemes. Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), featuring [Zod](https://zod.dev) schema validation, automated sidebar discovery, and GitHub Pages deployment.

---

## 🏛 The 3 Core Themes

### 1. `ai-real-world` — AI for Real-World Use Cases
- **Productivity & Automation**: Agentic workflows, automated pipelines, document intelligence.
- **Industry Applications**: Sector-specific deployments (Healthcare, Finance, etc.).

### 2. `ai-for-security` — AI for Security
- **Threat Detection**: Anomaly analysis, behavioral threat hunting, telemetry correlation.
- **SOC Automation**: LLM-assisted alert triage, automated contextual enrichment.
- **Incident Response**: Forensic playbooks, blast radius analysis, automated runbooks.

### 3. `security-for-ai` — Security for AI
- **Governance & Compliance**: NIST AI RMF, ISO/IEC 42001, EU AI Act, policy baselines.
- **Secure Development**: Adversarial training, data poisoning mitigation, model verification.
- **Operations & MLOps**: Hardened API gateways, supply chain provenance, inference isolation.
- **Threats & Defenses**: Prompt injection mitigations, guardrails, jailbreak defenses.

---

## 📂 Folder-Driven Content Structure

Any folder inside `src/content/docs/` automatically maps into the navigation sidebar. Subfolders become nested, collapsible groups to any depth:

```text
src/content/docs/
├── index.mdx                                       # Main Portal Landing Page
├── ai-real-world/
│   ├── index.md                                    # Theme Overview
│   ├── _meta.yml                                   # Label & ordering config (optional)
│   ├── productivity-automation/
│   │   └── agentic-workflows.md
│   └── industry/
│       ├── healthcare/
│       └── finance/
├── ai-for-security/
│   ├── index.md
│   ├── incident-response/
│   │   └── ai-incident-triage-playbook.md
│   ├── soc-automation/
│   │   └── automated-alert-triage-with-llms.md
│   └── threat-detection/
└── security-for-ai/
    ├── index.md
    ├── governance/
    │   ├── ai-governance-frameworks.md
    │   └── enterprise-ai-planning-governance.md
    ├── operations/
    │   └── llmops-api-security.md
    ├── secure-development/
    │   └── adversarial-training-fundamentals.md
    └── threats-defenses/
        └── prompt-injection-mitigation.md
```

---

## ✍️ Adding New Articles

To add content, simply drop a `.md` or `.mdx` file into any folder or subfolder. 

### Minimal Frontmatter Requirement

```markdown
---
title: "Your Article Title"
description: "A summary of what this guide covers."
---

## Executive Summary
Your content goes here...
```

*(Optional fields: `tags: [...]`, `threat_level: "Low" | "Medium" | "High" | "Critical"`, `date: YYYY-MM-DD`, `draft: false`, `sidebar: { order: 1 }`)*

### Folder Display & Ordering (`_meta.yml`)

Add an optional `_meta.yml` in any subfolder to customize its display name or sort position:

```yaml
label: "Threats & Defenses"
order: 1
collapsed: false
```

### Command-Line Scaffolding Tool

You can also use the CLI helper to scaffold articles:

```bash
# Using Node.js
node scripts/add_article.mjs --path security-for-ai/threats-defenses --title "Model Inversion Defenses" --threat-level High

# Using Python
python scripts/add_article.py --path ai-real-world/industry/finance --title "Automated Credit Risk Analysis"
```

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Start local preview server
npm run dev

# Build production bundle (dist/)
npm run build
```
