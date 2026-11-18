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
* **Fact-Checking Guardrail:** Includes an integrated audit step using `gemini-3.5-flash` to detect and filter out hallucinations or inflated threat claims before publishing.
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

## 🗄️ Database Setup (Supabase)

Run the following SQL script in your **Supabase SQL Editor** to initialize the vector database table and similarity matching function:

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for storing news chunks and embeddings
CREATE TABLE IF NOT EXISTS news_embeddings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,
  url TEXT UNIQUE,
  market_region VARCHAR DEFAULT 'GLOBAL',
  ticker VARCHAR,
  published_at TIMESTAMPTZ,
  content_chunk TEXT,
  embedding VECTOR(768)
);

-- Index for fast cosine similarity search
CREATE INDEX ON news_embeddings USING hnsw (embedding vector_cosine_ops);

-- RPC function for Cosine Similarity search
CREATE OR REPLACE FUNCTION match_historical_news (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id bigint,
  title text,
  url text,
  market_region varchar,
  content_chunk text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    news_embeddings.id,
    news_embeddings.title,
    news_embeddings.url,
    news_embeddings.market_region,
    news_embeddings.content_chunk,
    1 - (news_embeddings.embedding <=> query_embedding) AS similarity
  FROM news_embeddings
  WHERE 1 - (news_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY news_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## ⚙️ Environment Variables

Set credentials in your github's repository secrets):

```env
# LLM Providers
DEEPSEEK_API_KEY=your_deepseek_api_key
GEMINI_API_KEY=your_gemini_api_key_for_embeddings
GEMINI_API_KEY_2=your_gemini_api_key_for_verification  # Optional / can match GEMINI_API_KEY

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_CHAT_ID_PAID=@YourPaidChannelOrChatID
TELEGRAM_CHAT_ID_FREE=@YourFreeTeaserChannelID  # Optional

# Google Sheets (Optional)
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SHEETS_CREDENTIALS='{"type": "service_account", ...}'
```

---

## 🚀 Local Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aientre86/cyber-threat-landscape-insights-broadcast.git
   cd cyber-threat-landscape-insights-broadcast
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the pipeline manually:**
   ```bash
   python main.py
   ```

---

## ⏰ Automated Serverless Deployment (GitHub Actions)

The repository includes a GitHub Actions workflow in [`.github/workflows/schedule.yml`](.github/workflows/schedule.yml) configured to execute automatically every day at **00:00 UTC (08:00 AM SGT)**:

1. Push your repository to GitHub.
2. In your GitHub repository, navigate to **Settings > Secrets and variables > Actions**.
3. Add the environment variables listed above as **Repository secrets**.
4. Test run anytime by navigating to the **Actions** tab, selecting **Cyber Threat Landscape Brief**, and clicking **Run workflow**.

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
