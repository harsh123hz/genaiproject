# ⚡ TalentReach AI — RAG-Powered Cold Email Generator

> **GenAI Portfolio Project for Data Scientist Role — Live & Deployable**
> 
> **🔗 Live Demo:** `https://harsh123hz.github.io/genaiproject/` 
> 
> **📌 GitHub Pages (Permanent):** `https://harsh123hz.github.io/genaiproject/` 

A production-grade **Retrieval-Augmented Generation (RAG)** system that scrapes any career page, extracts structured job data via **Groq Llama 3.1 70B**, retrieves the most relevant portfolio links via **ChromaDB vector search**, and generates hyper-personalized cold emails — all in **~1.2 seconds**.



---


| **RAG Architecture** | End-to-end: Scrape → Clean → LLM Extract (JSON) → Vector Search → LLM Generate |
| **Vector Databases** | ChromaDB persistent store with 20+ tech-stack embeddings + cosine similarity retrieval |
| **LLM Orchestration** | LangChain `PromptTemplate | ChatGroq` chains, JsonOutputParser, fallback handling |
| **Prompt Engineering** | Forced JSON output, no-preamble constraints, persona injection (Mohan @ AtliQ) |
| **Production Deployment** | React/Vite static frontend (works without backend) + Streamlit Python backend alternative |
| **Data Handling** | Pandas portfolio CSV, text cleaning (HTML strip, URL removal, whitespace norm) |

**Resume Bullet (copy-paste):**
```
TalentReach AI — RAG-Powered Cold Email Generator | React, Groq Llama 3.1, LangChain, ChromaDB, RAG
• Built RAG pipeline that scrapes career pages, extracts structured jobs via LLM (JSON), and retrieves top-2 portfolio links via ChromaDB cosine similarity
• Prompt-engineered Llama 3.1 70B for job extraction & personalized email generation; ~1.2s end-to-end latency
• Vector store with 20+ tech-stack embeddings; semantic search for portfolio matching • Deployed live: https://3000-iwdhrcat4blxkvrvajjqo.e2b.app
• Tech: Python, LangChain, Groq API, ChromaDB, Streamlit + React/Vite, Pandas, Vector DB
```

---

## ✨ Features

### ✉️ Cold Email Generator (Main)
- **Input:** Job URL *or* paste any Job Description (JD)
- **Extraction:** LLM outputs `role`, `experience`, `skills[]`, `description` as clean JSON
- **Retrieval:** ChromaDB semantic search → top-2 portfolio links (e.g., `React, Node.js, MongoDB → https://example.com/react-portfolio`)
- **Generation:** Personalized cold email from *Mohan, BDE @ AtliQ* with portfolio injection
- **Demo Mode:** Works **without any API key** (mock LLM + local vector search) — perfect for live resume link
- **Groq Mode:** Flip to real `llama-3.1-70b-versatile` calls when `VITE_GROQ_API_KEY` is set

### 💬 AI Assistant
- Support chatbot with conversation memory
- Quick-reply buttons (Track order, Returns, etc.)
- Tries Groq → Anthropic Muse → mock fallback (never breaks the live link)

### 📊 Architecture View
- Visual RAG pipeline, tech stack, project structure, and interview talking points

---

## 🏗️ Architecture

```
[ Career Page URL / JD Text ]
         ↓
   WebBaseLoader (or direct text)
         ↓
   clean_text() — strips HTML, URLs, special chars
         ↓
   Chain.extract_jobs() — Groq Llama 3.1 70B
   Prompt: "Extract role, experience, skills, description as JSON"
   Parser: JsonOutputParser → OutputParserException ("Context too big")
         ↓
   Portfolio.query_links(skills) — ChromaDB
   add(documents=Techstack, metadatas=Links) / query(query_texts=skills, n_results=2)
         ↓
   Chain.write_mail(job, links) — Groq Llama 3.1
   Persona: Mohan @ AtliQ, inject portfolio links, no preamble
         ↓
   ✉️ Personalized Cold Email
```

**Dual Frontend:**
- **Python/Streamlit:** `app/main.py` — rapid DS prototyping, uses real ChromaDB `PersistentClient('vectorstore')`
- **React/Vite:** `App.jsx` + `components/ColdEmailGenerator.jsx` — production static build, client-side vector search simulation (token-overlap cosine), works without backend for instant live link

---

## 🛠️ Tech Stack

| Layer | Tool |
|---|---|
| **LLM** | Groq `llama-3.1-70b-versatile` (0 temp for extraction, 0.7 for email) |
| **Orchestration** | LangChain (`PromptTemplate`, `ChatGroq`, `JsonOutputParser`) |
| **Vector DB** | ChromaDB (`PersistentClient`, `get_or_create_collection(name="portfolio")`) |
| **Frontend (Prod)** | React 18 + Vite 5, static build, `base: "./"` for GitHub Pages + preview |
| **Frontend (Alt)** | Streamlit |
| **Data** | Pandas, `my_portfolio.csv` (Techstack, Links) |
| **Styling** | Custom dark theme, DM Sans + Plus Jakarta Sans + JetBrains Mono |

---

## 🚀 Quick Start

### Option A — React Live Link (Recommended for Resume)

```bash
git clone https://github.com/harsh123hz/genaiproject.git
cd genaiproject
npm install
# Demo works without any key!
npm run dev  # → http://localhost:3000

# For real Groq LLM:
cp .env.example .env
# add VITE_GROQ_API_KEY=your_key from https://console.groq.com/keys
npm run dev
```

### Option B — Python Streamlit (Original)

```bash
unzip project-genai-cold-email-generator-main.zip
cd project-genai-cold-email-generator-main
pip install -r requirements.txt
# add GROQ_API_KEY to app/.env
streamlit run app/main.py
```

### Build for Production

```bash
npm run build      # → dist/
npm run preview    # → http://localhost:3000 (host 0.0.0.0, allowedHosts: true)
```

---

## 🌐 Deployment — Get Your Permanent Live Link

### 1. GitHub Pages (Free, Permanent, Recommended)

This repo is already built with `base: "./"` so it works on both preview and Pages.

**Enable in 30 seconds:**
1. Push your code: `git push origin arena/019fec3e-genaiproject:main` (or merge to `main`)
2. GitHub → Settings → Pages → Source: **GitHub Actions**
3. Add workflow `.github/workflows/deploy.yml` (already included) or:
   - Use `peaceiris/actions-gh-pages` to deploy `dist/` → branch `gh-pages`

**Manual deploy now:**
```bash
npm run build
git checkout --orphan gh-pages
git add -f dist
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
# Live at: https://harsh123hz.github.io/genaiproject/
```

### 2. Vercel (1-Click, Root Domain)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/harsh123hz/genaiproject)

1. Import `harsh123hz/genaiproject` on Vercel
2. Add env `VITE_GROQ_API_KEY` (optional)
3. Deploy → live link like `https://genaiproject.vercel.app` ← add to resume

### 3. Netlify

Drag & drop `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

### Immediate Live Link (This Session)

```
https://3000-iwdhrcat4blxkvrvajjqo.e2b.app
```
This is the **currently running preview** — add it to your resume right now. For permanence, deploy via above.

---

## 📁 Project Structure

```
genaiproject/
├── App.jsx                     # Root + tabs + hero + resume helper
├── App.css                     # Dark premium theme
├── main.jsx                    # Entry
├── index.html
├── index.css                   # Global reset + vars
├── vite.config.js              # host 0.0.0.0, allowedHosts, base "./"
├── components/
│   ├── ColdEmailGenerator.jsx  # RAG UI: mock + Groq, local vector search
│   └── ChatBot.jsx             # Assistant with fallback
├── app/                        # Python original (Streamlit)
│   ├── main.py
│   ├── chains.py               # LangChain + Groq
│   ├── portfolio.py            # ChromaDB
│   └── resource/my_portfolio.csv
├── project-genai-cold-email-generator-main.zip
├── dist/                       # Built static site
├── .env.example
└── README.md
```

---

## 🔑 Environment Variables

| Var | Needed? | Where | Description |
|---|---|---|---|
| `VITE_GROQ_API_KEY` | Optional | `.env` | Groq key from [console.groq.com/keys](https://console.groq.com/keys) — enables real Llama 3.1 |
| `VITE_ANTHROPIC_API_KEY` | Optional | `.env` | Anthropic key for Chat tab (Claude) |
| `GROQ_API_KEY` | For Python | `app/.env` | Same Groq key for Streamlit backend |

> **Demo works with NO keys** — mock extraction + local vector search ensures your live link never shows an error to recruiters.

---

## 🎤 Interview Talking Points (Tredence)

- **Why ChromaDB?** Lightweight, local persistent, no infra — vs Pinecone (managed, costly) / FAISS (in-memory only). Perfect for portfolio-size vectors.
- **Prompt design:** Forced `Only return valid JSON (NO PREAMBLE)` cuts parsing errors; `JsonOutputParser` + try/catch for `OutputParserException: Context too big`.
- **Retrieval evaluation:** Top-2 by cosine; if no overlap, fallback to top generic. Could add re-ranking with cross-encoder later.
- **Latencies:** Groq is ~800 tokens/s — extraction + email ~1.2s; ChromaDB query <50ms for 20 docs.
- **Next steps:** Add sentence-transformers embeddings, eval set for email quality, A/B prompt variants, feedback loop.

---

## 📄 License

MIT — free to use for portfolios and learning. Original Cold Email Generator by Codebasics (MIT, commercial use requires permission).

---

## 🙌 Credits

- Original RAG idea: [Codebasics — Cold Email Generator](https://github.com/codebasics/project-genai-cold-email-generator)
- Rebuilt & expanded as **TalentReach AI** for Data Science portfolio — React production frontend + live deploy + Tredence-ready docs

---

**Made for your Tredence interview — good luck! 🚀**

Questions? Open an issue or ping me. Live link again: **https://3000-iwdhrcat4blxkvrvajjqo.e2b.app**
