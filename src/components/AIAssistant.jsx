import { useState } from "react";
import { askGemini } from "../services/geminiService";
import "./AIAssistant.css";

function formatAIText(text) {
  return text.split("\n").map((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return (
        <div
          className="ai-line-space"
          key={index}
        ></div>
      );
    }

    if (trimmedLine.startsWith("### ")) {
      return (
        <h4 key={index}>
          {trimmedLine.replace("### ", "")}
        </h4>
      );
    }

    if (trimmedLine.startsWith("## ")) {
      return (
        <h3 key={index}>
          {trimmedLine.replace("## ", "")}
        </h3>
      );
    }

    if (trimmedLine.startsWith("# ")) {
      return (
        <h3 key={index}>
          {trimmedLine.replace("# ", "")}
        </h3>
      );
    }

    if (trimmedLine.startsWith("- ")) {
      return (
        <li key={index}>
          {formatInlineMarkdown(
            trimmedLine.replace("- ", "")
          )}
        </li>
      );
    }

    if (/^\d+\.\s/.test(trimmedLine)) {
      return (
        <li key={index}>
          {formatInlineMarkdown(
            trimmedLine.replace(/^\d+\.\s/, "")
          )}
        </li>
      );
    }

    return (
      <p key={index}>
        {formatInlineMarkdown(trimmedLine)}
      </p>
    );
  });
}

function formatInlineMarkdown(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (
      part.startsWith("**") &&
      part.endsWith("**")
    ) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm Wanderly AI. Ask me about destinations, places to visit, or travel ideas.",
    },
  ]);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        text: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const prompt = `
You are Wanderly AI, a helpful and friendly travel assistant.

Help the user with travel destinations, famous places,
activities, travel tips, food, culture, and itinerary ideas.

Keep your answer useful, concise, and easy to read.
Use short sections and bullet points when appropriate.
Do not claim real-time information such as current weather,
prices, availability, or live events.

User's question:
${trimmedMessage}
`;

      const response = await askGemini(prompt);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          text: response,
        },
      ]);
    } catch (error) {
      console.error("Gemini error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          text:
            error.message ||
            "Sorry, I couldn't get a response right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="ai-assistant"
      id="assistant"
    >
      <div className="ai-assistant-container">
        <div className="ai-assistant-heading">
          <p className="section-eyebrow">
            YOUR TRAVEL COMPANION
          </p>

          <h2>
            Ask Wanderly
            <br />
            anything.
          </h2>

          <p>
            Get destination ideas, travel tips and personalized
            itinerary suggestions with your AI travel companion.
          </p>
        </div>

        <div className="ai-chat">
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <span className="ai-status-dot"></span>

              <div>
                <strong>Wanderly AI</strong>
                <span>Travel assistant</span>
              </div>
            </div>
          </div>

          <div className="ai-messages">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={
                  item.role === "user"
                    ? "ai-message user-message"
                    : "ai-message assistant-message"
                }
              >
                {item.role === "assistant" ? (
                  <div className="ai-formatted-response">
                    {formatAIText(item.text)}
                  </div>
                ) : (
                  <p>{item.text}</p>
                )}
              </div>
            ))}

            {loading && (
              <div className="ai-message assistant-message">
                <div
                  className="ai-formatted-response ai-thinking"
                  aria-label="Wanderly AI is thinking"
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <form
            className="ai-input-area"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Ask about a destination..."
              aria-label="Ask Wanderly AI"
              disabled={loading}
            />

            <button
              type="submit"
              aria-label="Send message"
              disabled={loading}
            >
              →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AIAssistant;