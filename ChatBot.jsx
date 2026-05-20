import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

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

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi there! 👋 I'm your support assistant. How can I help you today? You can ask me about orders, returns, shipping, account issues, or anything else!",
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
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("Missing VITE_ANTHROPIC_API_KEY in .env");

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-allow-browser": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: historyRef.current,
        }),
      });

      const data = await res.json();
      const reply =
        data.content?.find((b) => b.type === "text")?.text ||
        "Sorry, I could not get a response. Please try again.";

      historyRef.current = [
        ...historyRef.current,
        { role: "assistant", content: reply },
      ];
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Sorry, something went wrong: ${e.message}. Please contact support@store.com`,
        },
      ]);
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
    <div className="chat-wrapper">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="agent-avatar">
            <span className="avatar-icon">🎧</span>
          </div>
          <div className="agent-info">
            <p className="agent-name">Support Assistant</p>
            <p className="agent-status">
              <span className="status-dot" />
              Online
            </p>
          </div>
          <button className="clear-btn" onClick={clearChat} title="Clear chat">
            ↺ Clear
          </button>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role}`}>
              <div className={`avatar ${msg.role}`}>
                {msg.role === "assistant" ? "🎧" : "👤"}
              </div>
              <div className={`bubble ${msg.role}`}>{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="avatar assistant">🎧</div>
              <div className="bubble assistant typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          {!quickHidden && (
            <div className="quick-replies">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.label}
                  className="quick-btn"
                  onClick={() => sendMessage(q.text)}
                >
                  {q.emoji} {q.label}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <div className="input-row">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here..."
              rows={1}
              className="chat-input"
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              ➤ Send
            </button>
          </div>
          <p className="input-hint">Powered by Claude AI · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
