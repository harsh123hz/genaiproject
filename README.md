# 🎧 Customer Support Chatbot

An AI-powered customer support chatbot built with **React + Vite** and the **Anthropic Claude API**. Handles common support queries like order tracking, returns, shipping, and account issues — with quick-reply buttons and full conversation memory.

[Chatbot Preview]--->(https://harsh123hz.github.io/genaiproject/

---

## ✨ Features

- 💬 **Live AI responses** powered by Claude (`claude-sonnet-4-20250514`)
- 🚀 **Quick-reply buttons** for the most common support questions
- 🧠 **Conversation memory** — Claude remembers the full chat history within a session
- 🔄 **Clear chat** button to reset the conversation
- ⌨️ **Keyboard shortcut** — `Enter` to send, `Shift+Enter` for a new line
- 🎨 **Clean, polished UI** with smooth animations
- 📱 **Responsive design** — works on mobile and desktop

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Anthropic Claude API](https://docs.anthropic.com/) | AI responses |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/customer-support-chatbot.git
cd customer-support-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

> 🔑 Get your API key at [console.anthropic.com](https://console.anthropic.com/)

### 4. Run the development server

```bash
npm run dev
```

Open (https://harsh123hz.github.io/genaiproject/) in your browser.

---

## 📁 Project Structure

```
customer-support-chatbot/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Root component
│   ├── ChatBot.jsx      # Main chatbot component
│   ├── ChatBot.css      # Styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Customization

### Change the business / domain

Edit the `SYSTEM_PROMPT` constant in `src/ChatBot.jsx`:

```js
const SYSTEM_PROMPT = `You are a support assistant for [YOUR BUSINESS].
You help with:
- [Topic 1]
- [Topic 2]
...`;
```

### Change quick-reply buttons

Edit the `QUICK_QUESTIONS` array in `src/ChatBot.jsx`:

```js
const QUICK_QUESTIONS = [
  { emoji: "📦", label: "My label", text: "Full question text to send" },
  // add more...
];
```

### Change the AI model

In `src/ChatBot.jsx`, update the model string:

```js
model: "claude-sonnet-4-20250514",   // fast & capable
// or
model: "claude-opus-4-20250514",     // most capable
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Deploy to any static host:

- [Vercel](https://vercel.com/) — `vercel deploy`
- [Netlify](https://netlify.com/) — drag & drop `dist/`
- [GitHub Pages](https://pages.github.com/) — push `dist/` to `gh-pages` branch

> ⚠️ **Important:** When deploying, add `VITE_ANTHROPIC_API_KEY` as an environment variable in your hosting platform — never hard-code it.

---

## 🔒 Security Note

This project calls the Anthropic API directly from the browser (client-side). This is fine for demos and prototypes, but for production apps you should:

1. Create a **backend server** (Node.js/Express, Next.js API route, etc.)
2. Store the API key **server-side only**
3. Proxy all API calls through your backend

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙌 Contributing

Pull requests are welcome! Please open an issue first to discuss what you'd like to change.

---

Made with ❤️ using [Claude AI](https://anthropic.com)
