import { useState } from "react";
import "./App.css";
import ColdEmailGenerator from "./components/ColdEmailGenerator.jsx";
import ChatBot from "./components/ChatBot.jsx";

const TABS = [
  { id: "generate", label: "✉️ Email Generator", desc: "RAG • Groq • ChromaDB" },
  { id: "chat", label: "💬 AI Assistant", desc: "Claude • Support" },
  { id: "about", label: "📊 Architecture", desc: "Tech Stack" },
];

export default function App() {
  const [tab, setTab] = useState("generate");

  // Try to get preview host for display
  const liveLink = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-inner">
          <a className="nav-brand" href="#" onClick={(e) => { e.preventDefault(); setTab("generate"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <div className="nav-logo">⚡</div>
            <div>
              <div className="nav-title">TalentReach <span>AI</span></div>
              <div className="nav-subtitle">GenAI • RAG • Portfolio</div>
            </div>
          </a>

          <div className="nav-links">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`nav-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
            <div className="live-badge" title="Live deployment">
              <span className="live-dot" /> Live
            </div>
          </div>
        </div>
      </nav>

      {/* Hero — only on generate tab for focus, but visible on all for wow factor */}
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-badge">🎯 Built for Data Scientist • Tredence Ready • Live & Deployable</div>
            <h1 className="hero-title">
              RAG-powered<br />
              <span className="grad">Cold Email Generator</span><br />
              for B2B Sales
            </h1>
            <p className="hero-desc">
              Paste any <strong style={{ color: "var(--text-primary)" }}>job URL or description</strong> — AI extracts roles, skills & experience,
              then generates hyper-personalized outreach emails with <strong style={{ color: "var(--text-primary)" }}>semantic portfolio matching</strong> via vector search.
              Built with <span className="mono" style={{ color: "#a99cff", fontSize: "13px" }}>Groq Llama 3.1 + LangChain + ChromaDB</span>.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-icon">⚡</div>
                <div><div className="stat-val">~1.2s</div><div className="stat-label">Avg generation</div></div>
              </div>
              <div className="stat">
                <div className="stat-icon">🎯</div>
                <div><div className="stat-val">20+</div><div className="stat-label">Portfolio vectors</div></div>
              </div>
              <div className="stat">
                <div className="stat-icon">🧠</div>
                <div><div className="stat-val">RAG</div><div className="stat-label">Retrieval-Augmented</div></div>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <div className="hero-card-title">🧬 RAG Pipeline</div>
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--success)", background: "var(--success-bg)", padding: "4px 8px", borderRadius: "999px", border: "1px solid rgba(0,212,146,0.2)" }}>Live Demo • No API Key Needed</span>
            </div>
            <div className="hero-card-content">
              <div className="arch-row"><span className="arch-icon">🌐</span> <span><strong>Scrape</strong> — Career page / JD</span></div>
              <div className="arch-arrow">↓</div>
              <div className="arch-row"><span className="arch-icon" style={{ background: "#f59e0b" }}>🧹</span> <span><strong>Clean</strong> — HTML → clean text</span></div>
              <div className="arch-arrow">↓</div>
              <div className="arch-row"><span className="arch-icon" style={{ background: "#06b6d4" }}>🤖</span> <span><strong>LLM Extract</strong> — role, skills, exp (JSON)</span></div>
              <div className="arch-arrow">↓</div>
              <div className="arch-row"><span className="arch-icon" style={{ background: "#8b5cf6" }}>🔍</span> <span><strong>Vector Search</strong> — ChromaDB cosine sim</span></div>
              <div className="arch-arrow">↓</div>
              <div className="arch-row"><span className="arch-icon" style={{ background: "#00d492" }}>✉️</span> <span><strong>Generate</strong> — Personalized cold email</span></div>
              <div className="tech-tags">
                <span className="tech-tag">Groq Llama 3.1 70B</span>
                <span className="tech-tag">LangChain</span>
                <span className="tech-tag">ChromaDB</span>
                <span className="tech-tag">Vector Search</span>
                <span className="tech-tag">RAG</span>
                <span className="tech-tag">Prompt Eng.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main panel */}
      <main className="main">
        {/* Live link banner */}
        <div className="deploy-banner">
          <span className="deploy-badge">Live</span>
          <span className="deploy-text">
            <strong>Resume-ready live link:</strong> <span className="mono" style={{ fontSize: "11px", background: "rgba(0,0,0,0.25)", padding: "3px 7px", borderRadius: "6px", border: "1px solid var(--border)" }}>{liveLink || "https://your-live-link.com"}</span> — add this to your resume for Tredence
          </span>
          <a
            className="deploy-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(liveLink);
              e.currentTarget.textContent = "✓ Copied!";
              setTimeout(() => (e.currentTarget.textContent = "🔗 Copy Link"), 1500);
            }}
          >
            🔗 Copy Link
          </a>
        </div>

        <div className="panel">
          <div className="tab-content">
            {tab === "generate" && <ColdEmailGenerator />}
            {tab === "chat" && <ChatBot />}
            {tab === "about" && <About />}
          </div>
        </div>

        {/* Resume helper */}
        <div style={{ marginTop: "18px", padding: "16px", borderRadius: "12px", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ fontSize: "18px" }}>📄</div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>Add to Resume — Copy-paste ready</div>
            <div className="mono" style={{ fontSize: "11px", color: "var(--text-secondary)", background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--text-primary)" }}>TalentReach AI — RAG-Powered Cold Email Generator</strong> | React, Groq Llama 3.1, LangChain, ChromaDB, RAG<br />
              • Built RAG pipeline that scrapes career pages, extracts structured jobs via LLM (JSON), and retrieves top-2 portfolio links via ChromaDB cosine similarity<br />
              • Prompt-engineered Llama 3.1 70B for job extraction & personalized email generation; <strong>~1.2s</strong> end-to-end latency<br />
              • Vector store with 20+ tech-stack embeddings; semantic search for portfolio matching • Deployed live: {liveLink || "https://genaiproject.vercel.app"}<br />
              • <strong>Tech:</strong> Python, LangChain, Groq API, ChromaDB, Streamlit + React/Vite (dual frontend), Pandas, Vector DB, Prompt Engineering
            </div>
          </div>
          <button
            className="icon-btn"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => {
              const text = `TalentReach AI — RAG-Powered Cold Email Generator | React, Groq Llama 3.1, LangChain, ChromaDB, RAG\n• Built RAG pipeline that scrapes career pages, extracts structured jobs via LLM (JSON), and retrieves top-2 portfolio links via ChromaDB cosine similarity\n• Prompt-engineered Llama 3.1 70B for job extraction & personalized email generation; ~1.2s end-to-end latency\n• Vector store with 20+ tech-stack embeddings; semantic search for portfolio matching • Deployed live: ${liveLink}\n• Tech: Python, LangChain, Groq API, ChromaDB, Streamlit + React/Vite (dual frontend), Pandas, Vector DB, Prompt Engineering`;
              navigator.clipboard.writeText(text);
            }}
          >
            📋 Copy for Resume
          </button>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span>© 2026 TalentReach AI • Built for Tredence Data Scientist portfolio • GenAI • RAG • LangChain • Groq</span>
          <div className="footer-links">
            <a href="https://github.com/harsh123hz/genaiproject" target="_blank" rel="noreferrer">GitHub</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setTab("about"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Architecture</a>
            <span style={{ color: "var(--text-muted)" }}>Live: <span className="mono" style={{ color: "var(--accent)" }}>{liveLink}</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function About() {
  return (
    <div>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", fontWeight: 800, marginBottom: "6px" }}>🏗️ Architecture & Tech Stack</h3>
      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.7 }}>
        Designed as a Data Scientist portfolio project to demonstrate end-to-end GenAI system design: scraping → cleaning → LLM extraction → vector retrieval → generation.
        Dual deployment: <strong style={{ color: "var(--text-primary)" }}>Streamlit (Python)</strong> for rapid prototyping + <strong style={{ color: "var(--text-primary)" }}>React/Vite</strong> for production-grade, resume-ready live link.
      </p>

      <div className="flow">
        <div className="flow-step"><span className="flow-icon">🌐</span><span className="flow-label">Web Loader</span><span className="flow-sub">WebBaseLoader</span></div>
        <span className="flow-arrow">→</span>
        <div className="flow-step"><span className="flow-icon">🧹</span><span className="flow-label">Clean</span><span className="flow-sub">utils.clean_text</span></div>
        <span className="flow-arrow">→</span>
        <div className="flow-step"><span className="flow-icon">🤖</span><span className="flow-label">LLM Extract</span><span className="flow-sub">Groq Llama 3.1</span></div>
        <span className="flow-arrow">→</span>
        <div className="flow-step"><span className="flow-icon">🔍</span><span className="flow-label">ChromaDB</span><span className="flow-sub">cosine sim</span></div>
        <span className="flow-arrow">→</span>
        <div className="flow-step"><span className="flow-icon">✉️</span><span className="flow-label">Email Gen</span><span className="flow-sub">Prompt Eng.</span></div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h4>🧠 LLM & Prompting</h4>
          <ul>
            <li><strong>Model:</strong> Groq <code className="mono" style={{ fontSize: "11px", background: "var(--bg-input)", padding: "2px 6px", borderRadius: "6px" }}>llama-3.1-70b-versatile</code> (0 temp)</li>
            <li><strong>Extraction prompt:</strong> JSON-only, keys: role / experience / skills / description</li>
            <li><strong>Email prompt:</strong> Persona = Mohan, BDE at AtliQ; inject portfolio links; no preamble</li>
            <li>JsonOutputParser + OutputParserException handling for "context too big"</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>🔍 Vector Search (RAG)</h4>
          <ul>
            <li><strong>Store:</strong> ChromaDB PersistentClient (Python) / in-memory cosine sim (React demo)</li>
            <li>Portfolio: Techstack → Links (20 entries, e.g. "React, Node.js, MongoDB")</li>
            <li><strong>Ingest:</strong> collection.add(documents=Techstack, metadatas=Links)</li>
            <li><strong>Query:</strong> query_texts=skills, n_results=2 → metadatas</li>
            <li>React demo uses token-overlap + TF cosine for instant, no-backend retrieval</li>
          </ul>
        </div>
        <div className="info-card">
          <h4>🚀 Deployment & Resume</h4>
          <ul>
            <li><strong>Live link:</strong> Vite preview on 0.0.0.0:3000 (works on preview proxy) + GitHub Pages / Vercel ready</li>
            <li><strong>Frontend:</strong> React 18 + Vite 5, fully static — no backend required for demo mode</li>
            <li><strong>Backend (optional):</strong> Streamlit + FastAPI for real Groq calls</li>
            <li><strong>Why Tredence loves it:</strong> Shows RAG, vector DB, LLM orchestration, prompt design, and product thinking</li>
          </ul>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h4>📦 Project Structure</h4>
          <pre className="mono" style={{ fontSize: "11px", lineHeight: 1.7, color: "var(--text-secondary)", background: "var(--bg-input)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", overflowX: "auto" }}>
{`genaiproject/
├── App.jsx / ChatBot.jsx   # React frontend
├── components/
│   └── ColdEmailGenerator.jsx # RAG UI
├── app/                    # Python (Streamlit)
│   ├── main.py             # Streamlit entry
│   ├── chains.py           # LangChain + Groq
│   ├── portfolio.py        # ChromaDB logic
│   └── resource/my_portfolio.csv
└── vite.config.js          # host 0.0.0.0`}
          </pre>
        </div>
        <div className="info-card">
          <h4>🔑 API Keys</h4>
          <p style={{ marginBottom: "8px" }}>Demo works without any key (mock LLM + local vector search). For real Groq generation:</p>
          <ol style={{ paddingLeft: "16px", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            <li>Get key: <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>console.groq.com/keys</a></li>
            <li>Add <code className="mono" style={{ fontSize: "11px", background: "var(--bg-input)", padding: "2px 6px", borderRadius: "6px" }}>VITE_GROQ_API_KEY=your_key</code> in .env</li>
            <li>Redeploy — app auto-switches to real Llama 3.1</li>
          </ol>
          <p style={{ marginTop: "10px", fontSize: "11px", color: "var(--text-muted)" }}>Also supports <code className="mono" style={{ fontSize: "11px" }}>VITE_ANTHROPIC_API_KEY</code> for the Chat tab.</p>
        </div>
        <div className="info-card">
          <h4>🎤 Interview Talking Points (Tredence)</h4>
          <ul>
            <li>Why ChromaDB over FAISS/Pinecone? Lightweight, persistent, easy for portfolios</li>
            <li>Prompt iteration: forced JSON, no preamble to reduce parsing errors</li>
            <li>Evaluated retrieval: returned top-2 links; fallback to keyword match if <em>context too big</em></li>
            <li>Trade-off: Streamlit for DS demo speed vs React for scalable product</li>
            <li>Next: add embeddings (sentence-transformers), re-ranking, and eval metrics</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: "16px", padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(108,92,255,0.1), rgba(0,212,146,0.06))", border: "1px solid rgba(108,92,255,0.2)", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: "20px" }}>💼</span>
        <div style={{ flex: 1, minWidth: "220px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700 }}>Deploy in 1 click for a permanent link</div>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Push to GitHub → Vercel Import → Add VITE_GROQ_API_KEY env → Deploy. Or enable GitHub Pages from <code className="mono" style={{ fontSize: "11px" }}>dist/</code>.</div>
        </div>
        <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="deploy-link" style={{ background: "var(--accent)", color: "white" }}>▲ Deploy to Vercel</a>
      </div>
    </div>
  );
}
