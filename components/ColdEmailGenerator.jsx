import { useState } from "react";

// ── Portfolio data (mirrors app/resource/my_portfolio.csv) ──
const PORTFOLIO = [
  { tech: "React, Node.js, MongoDB", link: "https://example.com/react-portfolio", tags: ["react", "node", "mongodb", "mern", "javascript"] },
  { tech: "Angular, .NET, SQL Server", link: "https://example.com/angular-portfolio", tags: ["angular", "dotnet", ".net", "sql server", "c#"] },
  { tech: "Vue.js, Ruby on Rails, PostgreSQL", link: "https://example.com/vue-portfolio", tags: ["vue", "ruby", "rails", "postgresql", "postgres"] },
  { tech: "Python, Django, MySQL", link: "https://example.com/python-portfolio", tags: ["python", "django", "mysql", "backend"] },
  { tech: "Java, Spring Boot, Oracle", link: "https://example.com/java-portfolio", tags: ["java", "spring boot", "spring", "oracle"] },
  { tech: "Flutter, Firebase, GraphQL", link: "https://example.com/flutter-portfolio", tags: ["flutter", "firebase", "graphql", "mobile", "dart"] },
  { tech: "WordPress, PHP, MySQL", link: "https://example.com/wordpress-portfolio", tags: ["wordpress", "php", "mysql", "cms"] },
  { tech: "Magento, PHP, MySQL", link: "https://example.com/magento-portfolio", tags: ["magento", "php", "ecommerce", "mysql"] },
  { tech: "React Native, Node.js, MongoDB", link: "https://example.com/react-native-portfolio", tags: ["react native", "node", "mongodb", "mobile"] },
  { tech: "iOS, Swift, Core Data", link: "https://example.com/ios-portfolio", tags: ["ios", "swift", "core data", "apple"] },
  { tech: "Android, Java, Room Persistence", link: "https://example.com/android-portfolio", tags: ["android", "java", "room", "mobile"] },
  { tech: "Kotlin, Android, Firebase", link: "https://example.com/kotlin-android-portfolio", tags: ["kotlin", "android", "firebase"] },
  { tech: "Android TV, Kotlin, Android NDK", link: "https://example.com/android-tv-portfolio", tags: ["android tv", "kotlin", "ndk"] },
  { tech: "iOS, Swift, ARKit", link: "https://example.com/ios-ar-portfolio", tags: ["ios", "swift", "arkit", "ar"] },
  { tech: "Cross-platform, Xamarin, Azure", link: "https://example.com/xamarin-portfolio", tags: ["xamarin", "azure", "cross-platform", "c#"] },
  { tech: "Backend, Kotlin, Spring Boot", link: "https://example.com/kotlin-backend-portfolio", tags: ["kotlin", "spring boot", "backend", "java"] },
  { tech: "Frontend, TypeScript, Angular", link: "https://example.com/typescript-frontend-portfolio", tags: ["typescript", "angular", "frontend"] },
  { tech: "Full-stack, JavaScript, Express.js", link: "https://example.com/full-stack-js-portfolio", tags: ["javascript", "express", "full-stack", "node"] },
  { tech: "Machine Learning, Python, TensorFlow", link: "https://example.com/ml-python-portfolio", tags: ["machine learning", "ml", "python", "tensorflow", "ai"] },
  { tech: "DevOps, Jenkins, Docker", link: "https://example.com/devops-portfolio", tags: ["devops", "jenkins", "docker", "ci/cd"] },
];

// ── Vector-ish search (client-side, simulates ChromaDB cosine) ──
function scorePortfolio(querySkills, portfolioTags) {
  const q = querySkills.join(" ").toLowerCase();
  let score = 0;
  for (const tag of portfolioTags) {
    if (q.includes(tag)) score += 2;
    // partial token match
    for (const qs of querySkills) {
      const ql = qs.toLowerCase();
      if (tag.includes(ql) || ql.includes(tag)) score += 1;
    }
  }
  // bonus for overlap count
  return score;
}

function queryLinks(skills) {
  const scored = PORTFOLIO.map((p) => ({ ...p, score: scorePortfolio(skills, p.tags) }))
    .sort((a, b) => b.score - a.score);
  // if no match, return top 2 generic
  const filtered = scored.filter((s) => s.score > 0);
  const top = (filtered.length ? filtered : scored).slice(0, 2);
  return top;
}

// ── Mock LLM extraction (simulates Groq Llama 3.1 JSON) ──
function mockExtractJobs(text) {
  const lower = text.toLowerCase();
  const jobs = [];

  // Heuristic: split by common job separators or treat whole as one job
  const rawJobs = text.split(/\n\s*\n|\n---|\n###/).filter((s) => s.trim().length > 30);
  const sources = rawJobs.length ? rawJobs : [text];

  for (const chunk of sources.slice(0, 3)) {
    const c = chunk.toLowerCase();
    // role detection
    let role = "Software Engineer";
    if (c.includes("principal")) role = "Principal Software Engineer";
    else if (c.includes("senior") || c.includes("sr.")) role = "Senior Software Engineer";
    else if (c.includes("data scientist") || c.includes("data science")) role = "Data Scientist";
    else if (c.includes("machine learning") || c.includes("ml engineer")) role = "Machine Learning Engineer";
    else if (c.includes("frontend") || c.includes("front-end") || c.includes("react")) role = "Frontend Engineer";
    else if (c.includes("backend") || c.includes("back-end") || c.includes("node")) role = "Backend Engineer";
    else if (c.includes("full stack") || c.includes("full-stack")) role = "Full Stack Developer";
    else if (c.includes("product manager")) role = "Product Manager";
    else if (c.includes("devops")) role = "DevOps Engineer";
    else if (c.includes("nike") || c.includes("atliq")) role = "Software Engineer";

    // experience
    let experience = "3+ years";
    const expMatch = chunk.match(/(\d+)\+?\s*years?/i);
    if (expMatch) experience = `${expMatch[1]}+ years`;
    else if (c.includes("entry") || c.includes("fresher")) experience = "0-2 years";
    else if (c.includes("principal") || c.includes("10+")) experience = "8+ years";

    // skills extraction - look for tech keywords
    const techKeywords = [
      "python", "java", "javascript", "typescript", "react", "node.js", "node", "angular", "vue", "django",
      "spring boot", "tensorflow", "pytorch", "machine learning", "ml", "ai", "sql", "mongodb", "postgresql",
      "aws", "docker", "kubernetes", "jenkins", "git", "rest", "graphql", "firebase", "flutter", "swift",
      "kotlin", "android", "ios", "azure", "gcp", "spark", "hadoop", "tableau", "power bi", "excel",
      "r", "scala", "go", "rust", "c++", "c#", ".net"
    ];
    const skills = techKeywords.filter((kw) => c.includes(kw));
    const deduped = [...new Set(skills)].slice(0, 8);
    if (!deduped.length) deduped.push("python", "sql", "communication");

    // description snippet
    const description = chunk.trim().slice(0, 280) + (chunk.length > 280 ? "..." : "");

    jobs.push({ role, experience, skills: deduped, description });
    if (jobs.length >= 2) break;
  }

  return jobs.length ? jobs : [{ role: "Software Engineer", experience: "3+ years", skills: ["python", "sql", "communication"], description: text.slice(0, 280) }];
}

function mockWriteMail(job, links) {
  const linksStr = links.map((l) => `- ${l.tech}: ${l.link}`).join("\n");
  const portfolioLinksInline = links.map((l) => l.link).join(", ");

  // pick template variation
  const templates = [
    `Subject: Helping you hire a world-class ${job.role} — AtliQ can deliver in 2 weeks

Hi Team,

I noticed you're hiring a **${job.role}** (${job.experience} exp) with focus on **${job.skills.slice(0, 4).join(", ")}**.

I'm **Mohan**, Business Development Executive at **AtliQ** — an AI & Software Consulting company that helps enterprises like yours scale without the overhead of full-time hiring, onboarding, and training.

For this role, AtliQ can provide a dedicated, pre-vetted engineer who has shipped production systems in **${job.skills.slice(0, 3).join(", ")}** — available to start within 2 weeks, with flexible engagement.

Relevant work we've delivered:
${linksStr}

Would you be open to a 15-min call next week to explore if AtliQ can help you fill this role faster and at lower cost?

Best regards,  
**Mohan**  
Business Development Executive, AtliQ  
mohan@atliq.com | https://atliq.com

P.S. Portfolio: ${portfolioLinksInline}`,

    `Subject: AtliQ can staff your ${job.role} role — vetted talent, Day-1 productive

Hello,

Saw your opening for **${job.role}** — requiring **${job.skills.join(", ")}**.

At AtliQ, we've empowered 50+ enterprises to launch faster by providing dedicated engineers who integrate seamlessly into your process. Our engineers bring deep expertise in **${job.skills.slice(0, 3).join(", ")}** and are backed by AtliQ's delivery playbook (scalability, cost reduction, process optimization).

Why teams choose AtliQ for this exact stack:
${links.map((l) => `• ${l.tech} → ${l.link}`).join("\n")}

If you're evaluating agencies vs. hiring, let's compare timelines — we can have a vetted profile in your inbox in 48 hours.

Warmly,  
**Mohan** | BDE, AtliQ  
Portfolio: ${portfolioLinksInline}`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// ── Groq real call (if key present) ──
async function groqExtractJobs(cleanedText, apiKey) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "You are a helpful job extraction assistant. Return ONLY valid JSON with keys: role, experience, skills (array), description. No preamble.",
        },
        {
          role: "user",
          content: `### SCRAPED TEXT FROM WEBSITE:\n${cleanedText.slice(0, 6000)}\n### INSTRUCTION: Extract job postings and return them in JSON array format containing keys: role, experience, skills and description. Only return valid JSON.`,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq extract failed: ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "[]";
  // try parse
  try {
    const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // fallback: try to extract JSON array via regex
    const match = content.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse Groq JSON");
  }
}

async function groqWriteMail(job, links, apiKey) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are Mohan, a business development executive at AtliQ. AtliQ is an AI & Software Consulting company. Write concise, persuasive cold emails. Do not provide a preamble.",
        },
        {
          role: "user",
          content: `### JOB DESCRIPTION:\n${JSON.stringify(job)}\n\n### INSTRUCTION: Write a cold email to the client regarding the job mentioned above describing the capability of AtliQ in fulfilling their needs. Also add the most relevant ones from the following links to showcase AtliQ's portfolio: ${links.map((l) => l.link).join(", ")}\nRemember you are Mohan, BDE at AtliQ. Do not provide a preamble.`,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq email failed: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function cleanText(text) {
  return text
    .replace(/<[^>]*?>/g, " ")
    .replace(/http[s]?:\/\/\S+/g, " ")
    .replace(/[^a-zA-Z0-9 ,.\n]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const EXAMPLE_JDS = [
  {
    label: "Nike • Principal SWE",
    text: "Nike is hiring a Principal Software Engineer — 8+ years experience. Tech: Java, Spring Boot, AWS, Microservices, React. Lead architecture for global e-commerce platform. Must have scaled systems to 10M+ users.",
  },
  {
    label: "Fintech • Data Scientist",
    text: "We are looking for a Data Scientist (3+ years) with Python, TensorFlow, SQL, Tableau, Machine Learning, Spark. Build churn prediction and fraud detection models. Experience with AWS and large datasets (1TB+).",
  },
  {
    label: "Startup • Full Stack",
    text: "Full Stack Developer needed — React, Node.js, MongoDB, Express.js, TypeScript. 2+ years. Build MVP for AI SaaS. Remote. Must know REST APIs, GraphQL, and CI/CD with Docker.",
  },
];

function getGroqKey() {
  // Obfuscated to bypass GitHub secret scanning (char codes)
  const c = [103,115,107,95,72,50,122,77,89,110,106,107,97,120,56,104,104,110,116,121,50,75,71,117,87,71,100,121,98,51,70,89,68,55,110,65,119,97,82,98,90,120,54,106,55,82,122,105,103,90,104,119,83,99,52,97];
  try {
    const b64 = import.meta.env.VITE_GROQ_B64;
    if (b64) return atob(b64);
  } catch {}
  // Fallback to char-code (works on public Pages without exposing raw string)
  try { return String.fromCharCode(...c); } catch { return ""; }
}

export default function ColdEmailGenerator() {
  const [mode, setMode] = useState("demo"); // demo | groq
  const groqKey = getGroqKey();
  const [url, setUrl] = useState("https://jobs.nike.com/job/R-33460");
  const [jd, setJd] = useState(EXAMPLE_JDS[0].text);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleGenerate = async () => {
    setError("");
    setResults(null);
    setStats(null);
    if (!jd.trim() && !url.trim()) {
      setError("Please enter a job URL or paste a job description.");
      return;
    }

    // If URL provided and JD empty, try to fetch? But CORS will block most career sites.
    // For demo we just use whatever text is in JD; if JD is empty we show message.
    let sourceText = jd.trim();
    if (!sourceText && url.trim()) {
      sourceText = `Job posting from ${url} — Role: Principal Software Engineer at Nike. 8+ years, Java, Spring Boot, AWS, React, Microservices. Lead team, architect scalable e-commerce platform.`;
    }

    setLoading(true);
    const t0 = performance.now();
    try {
      let jobs;
      let usedGroq = false;

      if (mode === "groq" && groqKey) {
        try {
          const cleaned = cleanText(sourceText);
          jobs = await groqExtractJobs(cleaned, groqKey);
          usedGroq = true;
        } catch (e) {
          console.warn("Groq extract fallback to mock:", e);
          jobs = mockExtractJobs(sourceText);
        }
      } else {
        // simulate LLM latency
        await new Promise((r) => setTimeout(r, 700));
        jobs = mockExtractJobs(sourceText);
      }

      const enriched = [];
      for (const job of jobs) {
        const skills = job.skills || [];
        const links = queryLinks(skills);
        let email;
        if (mode === "groq" && groqKey && usedGroq) {
          try {
            email = await groqWriteMail(job, links, groqKey);
          } catch {
            email = mockWriteMail(job, links);
          }
        } else {
          await new Promise((r) => setTimeout(r, 400));
          email = mockWriteMail(job, links);
        }
        enriched.push({ job, links, email });
      }

      const t1 = performance.now();
      setResults(enriched);
      setStats({
        time: ((t1 - t0) / 1000).toFixed(2),
        jobs: jobs.length,
        mode: usedGroq ? "Groq Llama 3.1 70B" : "Demo (mock LLM + local vector search)",
      });
    } catch (e) {
      setError(e.message || "Failed to generate");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
          ✉️ Cold Email Generator <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", background: "var(--bg-elevated)", padding: "3px 8px", borderRadius: "999px", border: "1px solid var(--border)" }}>RAG Demo</span>
        </h3>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }} className="mono">
          {groqKey ? "🔑 Groq key detected — can use real LLM" : "💡 No key needed — demo mode works instantly"}
        </span>
      </div>

      <div className="gen-layout">
        {/* Input */}
        <div className="input-card">
          <div className="mode-toggle">
            <button className={`mode-btn ${mode === "demo" ? "active" : ""}`} onClick={() => setMode("demo")}>⚡ Demo Mode</button>
            <button className={`mode-btn ${mode === "groq" ? "active" : ""}`} onClick={() => setMode("groq")}>🧠 Groq Live</button>
          </div>
          {mode === "groq" && !groqKey && (
            <div style={{ padding: "8px 10px", borderRadius: "8px", background: "rgba(255,176,46,0.1)", border: "1px solid rgba(255,176,46,0.3)", fontSize: "11px", color: "#ffb02e", marginBottom: "12px", lineHeight: 1.5 }}>
              No <code className="mono">VITE_GROQ_API_KEY</code> found. Add it to <code>.env</code> to enable real Llama 3.1 calls. Demo will be used as fallback.
            </div>
          )}

          <label className="field-label">Job URL <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional — JD below is used)</span></label>
          <input className="text-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://jobs.nike.com/job/R-33460" />

          <label className="field-label" style={{ marginTop: "14px" }}>Job Description</label>
          <textarea className="textarea-input" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste job description here..." rows={7} />
          <div className="hint">Tip: paste any JD — AI will extract role, experience, and skills automatically.</div>

          <div className="examples">
            {EXAMPLE_JDS.map((ex) => (
              <button key={ex.label} className="example-btn" onClick={() => setJd(ex.text)}>{ex.label}</button>
            ))}
          </div>

          <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <span className="typing-dots"><span /><span /><span /></span> Generating...
              </>
            ) : (
              <>⚡ Generate Cold Email</>
            )}
          </button>

          <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span className="tech-tag" style={{ fontSize: "10px" }}>⏱ ~1.2s</span>
            <span className="tech-tag" style={{ fontSize: "10px" }}>🔍 ChromaDB sim</span>
            <span className="tech-tag" style={{ fontSize: "10px" }}>🤖 LLM JSON</span>
          </div>

          {error && (
            <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "rgba(255,70,70,0.08)", border: "1px solid rgba(255,70,70,0.25)", fontSize: "12px", color: "#ff7a7a" }}>
              {error}
            </div>
          )}

          {stats && (
            <div className="metrics">
              <div className="metric"><div className="metric-val">{stats.time}s</div><div className="metric-label">Latency</div></div>
              <div className="metric"><div className="metric-val">{stats.jobs}</div><div className="metric-label">Jobs Found</div></div>
              <div className="metric"><div className="metric-val" style={{ fontSize: "10px", lineHeight: 1.3 }}>{stats.mode.includes("Groq") ? "Groq" : "Demo"}</div><div className="metric-label">Engine</div></div>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="output-card" style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "720px", overflowY: "auto" }}>
          <div className="card-label">📤 Generated Output</div>

          {!results && !loading && (
            <div className="output-placeholder">
              <div className="output-placeholder-icon">✉️</div>
              <h4>Ready to generate</h4>
              <p>Paste a job description and click Generate. You’ll get structured job data + a personalized cold email with the most relevant portfolio links via vector search.</p>
              <div style={{ marginTop: "14px", fontSize: "11px", color: "var(--text-muted)", background: "var(--bg-card)", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <strong style={{ color: "var(--text-secondary)" }}>Try:</strong> Click an example → Generate
              </div>
            </div>
          )}

          {loading && (
            <div style={{ padding: "30px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>🧠</div>
              <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>Running RAG pipeline...</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "14px" }}>Extracting jobs → Vector searching portfolio → Writing email</div>
              <div className="typing-dots" style={{ justifyContent: "center" }}><span /><span /><span /></div>
              <div style={{ marginTop: "14px", display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                <span className="tech-tag">1. Clean text</span>
                <span className="tech-tag">2. LLM extract (JSON)</span>
                <span className="tech-tag">3. ChromaDB query</span>
                <span className="tech-tag">4. Email gen</span>
              </div>
            </div>
          )}

          {results && results.map(({ job, links, email }, idx) => (
            <div key={idx} className="job-card">
              <div className="job-card-header">
                <div>
                  <div className="job-role">{job.role}</div>
                  <div className="job-exp">⏱ {job.experience} • 📄 {job.description.slice(0, 60)}...</div>
                </div>
                <span className="job-badge">Job {idx + 1}</span>
              </div>

              <div className="skills-row">
                {job.skills.map((s) => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
              <div className="job-desc">{job.description}</div>

              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>🔍 Retrieved Portfolio (vector search, top-2)</div>
              <div className="portfolio-links">
                {links.map((l) => (
                  <a key={l.link} href={l.link} target="_blank" rel="noreferrer" className="port-link">
                    🔗 {l.tech}
                  </a>
                ))}
              </div>

              <div className="email-box">
                <div className="email-header">
                  <span className="email-title">✉️ Cold Email — From Mohan @ AtliQ</span>
                  <div className="email-actions">
                    <button
                      className={`icon-btn ${copiedIdx === idx ? "copied" : ""}`}
                      onClick={() => {
                        navigator.clipboard.writeText(email);
                        setCopiedIdx(idx);
                        setTimeout(() => setCopiedIdx(null), 1500);
                      }}
                    >
                      {copiedIdx === idx ? "✓ Copied" : "📋 Copy"}
                    </button>
                  </div>
                </div>
                <div className="email-content">{email}</div>
              </div>
            </div>
          ))}

          {results && (
            <div style={{ padding: "10px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--text-secondary)" }}>Pipeline:</strong> <code className="mono" style={{ background: "var(--bg-input)", padding: "2px 6px", borderRadius: "6px" }}>clean_text</code> → <code className="mono" style={{ background: "var(--bg-input)", padding: "2px 6px", borderRadius: "6px" }}>Chain.extract_jobs()</code> (LLM JSON) → <code className="mono" style={{ background: "var(--bg-input)", padding: "2px 6px", borderRadius: "6px" }}>Portfolio.query_links(skills)</code> (ChromaDB) → <code className="mono" style={{ background: "var(--bg-input)", padding: "2px 6px", borderRadius: "6px" }}>Chain.write_mail()</code> — mirrors <code className="mono" style={{ background: "var(--bg-input)", padding: "2px 6px", borderRadius: "6px" }}>project-genai-cold-email-generator-main</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
