---
title: "AI Synthesized Global Cyber Threat Landscape Insights"
description: "An automated, AI-augmented Cyber Threat Intelligence (CTI) pipeline that aggregates global threat telemetry, correlates events using vector search (RAG), synthesizes actionable threat briefs with Large Language Models, and broadcasts multi-tiered briefings to Telegram and Google Sheets."
sidebar:
  label: "AI Synthesized Global Cyber Threat Landscape Insights"
  order: 5
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 3
pillar: ""
tags:
  - "Cyber Threat Intelligence AI"
threat_level: "Low"
date: 2026-11-17
draft: false
---

# Cyber Threat Landscape Insights Brief 🛡️📡

An automated, AI-augmented Cyber Threat Intelligence (CTI) pipeline that aggregates global threat telemetry, correlates events using vector search (RAG), synthesizes actionable threat briefs with Large Language Models, and broadcasts multi-tiered briefings to Telegram and Google Sheets.

Designed as a zero-maintenance MicroSaaS with free tier infrastructure services (e.g. supabase), executed serverlessly on a daily schedule via GitHub Actions.

![Sample Telegram Broadcasts](Images/Global.png)
![Sample Telegram Broadcasts](Images/Ransomware_Darkweb.png)
![Sample Telegram Broadcasts](Images/AI_Driven.png)
![Sample Telegram Broadcasts](Images/Novel_TTP.png)
![Sample Telegram Broadcasts](Images/Infrastructure_Risk.png)
![Sample Telegram Broadcasts](Images/Defensive_Outlook.png)

> ### !TIP
> ### Want Real-Time Daily Global Cyber Threat Intelligence Insights?
> This automated global cyber threat intelligence synthesis runs live daily and broadcasts directly to a private Telegram channel.
>
> 🔒 **"Curated daily threat intelligence for rapid awareness of the latest global cyber threats.**
> 
> To request an access:
> 1. Follow / connect with me on [LinkedIn](https://www.linkedin.com/in/weicheng-alan-ong-cissp-cism-gmle-gcfa-gaips-gcti-73435298)
> 2. Send me a direct message with a brief note referencing **"AIxSEC - Daily CTI Telegram"**.
> 3. I'll personally share the private channel invite link!

---

## 🌟 Key Features

* **Multi-Source OSINT Ingestion:** Automatically ingests from reputable threat intelligence feeds, including:
  * **Agencies & Vendors:** CISA Advisories, Microsoft Security Blog, Google Threat Intelligence, Palo Alto Unit 42, Recorded Future, BleepingComputer.
  * **AI Threat Tracking:** Dedicated ingestion of AI/LLM-related threats and security incidents.
* **Intelligent Noise Filtering & Scraping:** Strips boilerplate disclaimers, navigation bars, and marketing noise using BeautifulSoup.
* **Vector Embeddings & Semantic Storage:** 
  * Chunks text into 500-word segments and generates 768-dimensional embeddings using Google's `gemini-embedding-2`.
  * Stores embeddings into **Supabase (PostgreSQL + `pgvector`)** with HNSW indexing for rapid cosine similarity matching.
* **RAG-Powered Threat Synthesis:**
  * Uses DeepSeek (`deepseek-v4-flash`) to analyze today's incoming news alongside retrieved historical context.
  * Produces structured Telegram-compatible HTML briefings broken down into six distinct sections:
    1. 🌍 **Global Threat Landscape** (Major campaigns & APT activity)
    2. 🕵️ **Ransomware & Dark Web** (Gang operations, data leaks, illicit markets)
    3. 🤖 **AI-Driven Threats** (Adversarial ML, LLM jailbreaks, automated exploitation)
    4. 🔬 **Novel TTPs** (Newly surfaced tactics, techniques, and procedures)
    5. 🛡️ **Defensive Outlook & Mitigations** (Actionable hardening guidance)
    6. 💼 **Strategic Infrastructure Risk** (Cross-sector impact & executive posture)
* **MicroSaaS Distribution:**
  * **Telegram Channel:** Delivers the tactical & strategic briefing.
  * **Google Sheets Sync:** Automatically archives broadcasts for long-term analysis or ingestion into Google NotebookLM.
* **Self-Cleaning DB Hygiene:** Automatically purges embeddings older than 30 days to keep database storage within free-tier limits.

---

## 🏗️ Architecture

```
                  [ Threat Intel RSS Feeds & Advisories ]
                                     │
                                     ▼
                      [ Ingestion & Web Scraping ]
                       (feedparser, BeautifulSoup)
                                     │
                                     ▼
   [ Gemini-Embedding-2 ] ──────► [ Supabase pgvector ]
                                     │ (Historical RAG Context)
                                     ▼
                      [ DeepSeek Synthesis Engine ]
                         (deepseek-v4-flash)
                                     │
                                     ▼
                      [ Gemini Verification Guardrail ]
                         (gemini-3.5-flash)
                                     │
          ┌──────────────────────────┴──────────────────────────┐
          ▼                                                     ▼
   [ Telegram Bot API ]                                 [ Google Sheets API ]
   ├── Telegram Channel                                 └── Long-term Archive &
                                                                NotebookLM Research
```

---

## 📋 Prerequisites

* **Python 3.11+**
* **Supabase Project** with the `pgvector` extension enabled.
* **DeepSeek API Key**
* **Google Gemini API Key(s)**
* **Telegram Bot Token** and Target Chat / Channel IDs.
* **Google Cloud Service Account** (optional, for Google Sheets sync).

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── schedule.yml       # Daily cron job definition
├── database.py                # Supabase vector database queries, inserts & purging
├── main.py                    # Core pipeline (ingestion, RAG, synthesis, broadcasting)
├── models.json                # Model reference definitions
├── requirements.txt           # Python package dependencies
├── secrets.env                # Local environment configuration (git-ignored)
└── README.md                  # Project documentation
```

---

## ⚠️ Disclaimer

*This pipeline generates algorithmic threat intelligence synthesized from open-source feeds and Large Language Models. It is distributed for defensive situational awareness and educational purposes only. It does not constitute professional incident response consulting or certified cybersecurity advisory services. Always independently verify indicators before altering enterprise configurations.*
