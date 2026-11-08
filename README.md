# AI & AI Security Knowledge Hub

A mobile-first, high-performance static documentation portal centered on **AI & AI Security** organized across 5 core pillars. Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build), featuring strict [Zod](https://zod.dev) schema validation, programmatic Python article ingestion, and automated GitHub Pages deployment via GitHub Actions.

---

## 🏛 The 5 Core Pillars

1. **`OG` - Oversight & Governance**
   - Compliance, EU AI Act, NIST AI RMF, ISO/IEC 42001, AI Safety Policies, System Categorization
2. **`DD` - Design & Development**
   - Secure AI Architecture, Model Evaluation, Adversarial Training, Data Poisoning Mitigation
3. **`IO` - Implementation & Operation**
   - Runtime Inference Security, LLMOps/MLOps Security, Tool Sandboxing, Model Supply Chain
4. **`PD` - Protection & Defense**
   - Prompt Injection Mitigation, Guardrails, AI Red Teaming, Adversarial Robustness
5. **`IN` - Investigation**
   - AI Forensics, Non-Deterministic Incident Triage, Blast Radius Analysis, Post-Mortems

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- Python 3.10+

### Installation
```bash
npm install
```

### Local Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## ✍️ Programmatic Article Ingestion

You can automatically generate and route articles into the proper pillar folder with validated YAML frontmatter using `scripts/add_article.py`:

```bash
# Ingest an article into the Protection & Defense (PD) pillar
python scripts/add_article.py \
  --pillar PD \
  --title "Indirect Prompt Injection via RAG" \
  --tags "prompt-injection,rag,guardrails" \
  --threat-level "Critical"
```

### CLI Arguments:
- `--pillar`: `OG`, `DD`, `IO`, `PD`, or `IN` (*Required*)
- `--title`: Article title (*Required*)
- `--tags`: Comma-separated tag list (*Required*)
- `--threat-level`: Optional `Low`, `Medium`, `High`, or `Critical`
- `--description`: Optional custom summary
- `--content`: Optional string, path to a `.md` file, or `-` for standard input
- `--draft`: Flag to mark article as a draft

---

## 🌐 GitHub Pages Deployment Configuration

### Base URL Customization
In `astro.config.mjs`:
```js
// If deploying to https://<username>.github.io/<repo-name>/
site: 'https://<username>.github.io',
base: '/<repo-name>',

// If deploying to a custom domain or root domain (e.g. https://<username>.github.io)
site: 'https://<username>.github.io',
// Remove or leave base undefined
```

### Continuous Deployment
The repository includes `.github/workflows/deploy.yml` which triggers automatically on pushes to `main`. To enable GitHub Pages:
1. Push repository to GitHub.
2. In GitHub repository settings: **Settings > Pages > Build and deployment > Source**, select **GitHub Actions**.
3. Every push to `main` will build and publish the latest docs automatically.
