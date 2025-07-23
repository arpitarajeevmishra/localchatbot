import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import MessageBubble from "../components/MessageBubble";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("chat-user-id");
    if (!userId) {
      router.replace("/");
    } else {
      loadLatestChat(userId);
    }
  }, []);

  const loadLatestChat = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/chat/${userId}`);
      const chats = await res.json();

      if (chats.length > 0) {
        const latest = chats[0];
        setChatId(latest.id);
        const msgRes = await fetch(`http://localhost:5000/api/chat/${latest.id}/messages`);
        const msgData = await msgRes.json();
        setMessages(msgData);
      } else {
        const created = await createNewChat(userId);
        setChatId(created.chatId);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  };

  const createNewChat = async (userId) => {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return await res.json();
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatId) return;

    const prompt = input.trim();
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    try {
      const res = await fetch(`http://localhost:5000/api/chat/${chatId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setLoading(false);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chat-user-id");
    localStorage.removeItem("chat-username");
    router.push("/");
  };

  const handleNewChat = async () => {
    const userId = localStorage.getItem("chat-user-id");
    const newChat = await createNewChat(userId);
    setChatId(newChat.chatId);
    setMessages([]);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div>
          <h2>CyberChat</h2>
          <button className="new-chat-btn" onClick={handleNewChat}>+ New Chat</button>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="chat-section">
        <div className="chat-window">
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && <p className="loading-msg">Thinking...</p>}
          <div ref={scrollRef} />
        </div>

        <div className="chat-input-section">
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}