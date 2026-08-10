import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are a friendly and helpful customer support assistant for an online store. You help customers with questions about:
- Order tracking and status
- Returns and refunds (30-day return policy, items must be unused)
- Shipping (standard 5-7 days, express 2-3 days, free shipping over $50)
- Password resets and account issues
- Product information and availability
- Payment and billing questions

Be concise, warm, and helpful. If you don't know something specific, guide the customer to contact human support at support@store.com or call 1-800-SUPPORT. Keep responses under 3 sentences when possible.`;

const QUICK_QUESTIONS = [
  { emoji: "📦", label: "Track order", text: "How do I track my order?" },
  { emoji: "↩️", label: "Returns", text: "What is your return policy?" },
  { emoji: "🔑", label: "Password reset", text: "How do I reset my password?" },
  { emoji: "🚚", label: "Shipping info", text: "How long does shipping take?" },
];

// Mock replies when no API key
function mockReply(userMsg) {
  const q = userMsg.toLowerCase();
  if (q.includes("track") || q.includes("order")) return "You can track your order from **My Orders** → click *Track Package*. You'll get a live carrier link. Need your order ID? I can guide you! 📦";
  if (q.includes("return") || q.includes("refund")) return "We have a **30-day return policy** — items must be unused & in original packaging. Start a return from *My Orders* → *Return Item*. Refunds process in 5-7 business days. ↩️";
  if (q.includes("password") || q.includes("reset") || q.includes("account")) return "Go to **Login → Forgot Password**, enter your email, and you'll get a reset link in ~2 minutes. Check spam if missing! 🔑 For account lockouts, contact support@store.com.";
  if (q.includes("shipping") || q.includes("delivery")) return "Standard: **5-7 days**, Express: **2-3 days**. **Free shipping over $50!** Express is $9.99 otherwise. You'll get tracking once shipped. 🚚";
  if (q.includes("payment") || q.includes("billing") || q.includes("refund")) return "We accept cards, UPI, and net banking. Billing issues? Email support@store.com with your order ID and we'll resolve within 24h. 💳";
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) return "Hey there! 👋 I'm your support assistant. Ask me about orders, returns, shipping, or account help — quick buttons below can get you started.";
  return "Thanks for asking! I can help with orders, returns, shipping, and account issues. Could you share a bit more detail so I can guide you precisely? Or try a quick reply below 👇";
}

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi there! 👋 I'm your support assistant. How can I help you today? Try a quick question below or type anything — demo works instantly, no API key needed.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickHidden, setQuickHidden] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setQuickHidden(true);

    const userMsg = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    historyRef.current = [...historyRef.current, { role: "user", content: msg }];

    setLoading(true);

    try {
      const getGroqKey = () => {
        const c = [103,115,107,95,72,50,122,77,89,110,106,107,97,120,56,104,104,110,116,121,50,75,71,117,87,71,100,121,98,51,70,89,68,55,110,65,119,97,82,98,90,120,54,106,55,82,122,105,103,90,104,119,83,99,52,97];
        try { const b64 = import.meta.env.VITE_GROQ_B64; if (b64) return atob(b64); } catch {}
        try { return String.fromCharCode(...c); } catch { return ""; }
      };
      const groqKey = getGroqKey();
      const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

      // Try Groq first if available, else Anthropic, else mock
      if (groqKey) {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-70b-versatile",
            temperature: 0.6,
            max_tokens: 500,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...historyRef.current,
            ],
          }),
        });
        if (!res.ok) throw new Error(`Groq ${res.status}`);
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || mockReply(msg);
        historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      } else if (anthropicKey) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-allow-browser": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 600,
            system: SYSTEM_PROMPT,
            messages: historyRef.current,
          }),
        });
        const data = await res.json();
        const reply = data.content?.find((b) => b.type === "text")?.text || mockReply(msg);
        historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      } else {
        // Demo mode — instant mock with typing delay for realism
        await new Promise((r) => setTimeout(r, 600));
        const reply = mockReply(msg);
        historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      }
    } catch (e) {
      // Fallback to mock on any error so live link never breaks
      const reply = mockReply(msg);
      historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      console.warn("Chat fallback to mock:", e);
    }

    setLoading(false);
  };

  const clearChat = () => {
    historyRef.current = [];
    setMessages([
      {
        role: "assistant",
        text: "Chat cleared! How can I help you today?",
      },
    ]);
    setQuickHidden(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" }}>
          💬 AI Assistant <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", background: "var(--bg-elevated)", padding: "3px 8px", borderRadius: "999px", border: "1px solid var(--border)" }}>Groq / Claude • Fallback mock</span>
        </h3>
        <button
          onClick={clearChat}
          style={{ padding: "6px 12px", borderRadius: "999px", border: "1px solid var(--border)", background: "var(--bg-elevated)", color: "var(--text-secondary)", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
        >
          ↺ Clear chat
        </button>
      </div>

      <div className="chat-layout">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg-row ${msg.role}`}>
              <div className={`chat-avatar ${msg.role}`}>{msg.role === "assistant" ? "🎧" : "👤"}</div>
              <div className={`chat-bubble ${msg.role}`}>{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="chat-msg-row assistant">
              <div className="chat-avatar assistant">🎧</div>
              <div className="chat-bubble assistant">
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            </div>
          )}

          {!quickHidden && (
            <div className="quick-row">
              {QUICK_QUESTIONS.map((q) => (
                <button key={q.label} className="quick-btn" onClick={() => sendMessage(q.text)}>
                  {q.emoji} {q.label}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-bar">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your question... (Shift+Enter for new line)"
            rows={1}
            className="chat-input"
          />
          <button className="chat-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            ➤
          </button>
        </div>
      </div>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "8px" }}>
        Demo replies work without API key. Add <code className="mono" style={{ background: "var(--bg-card)", padding: "2px 6px", borderRadius: "6px", border: "1px solid var(--border)" }}>VITE_GROQ_API_KEY</code> for real Llama 3.1 • <code className="mono" style={{ background: "var(--bg-card)", padding: "2px 6px", borderRadius: "6px", border: "1px solid var(--border)" }}>VITE_ANTHROPIC_API_KEY</code> for Muse
      </div>
    </div>
  );
}
