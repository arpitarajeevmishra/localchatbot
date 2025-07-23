import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("chat-username");
    setUsername(stored || "Guest");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/"); // ✅ go back to login page
  };

  const handleNewChat = () => {
    window.location.reload(); // keep this if you're using a single chat session
  };

  return (
    <div className="sidebar">
      <h2>🧠 ChatGPT UI</h2>
      <button className="new-chat-btn" onClick={handleNewChat}>+ New Chat</button>
      <div className="chat-history-placeholder">
        <p><b>{username}</b></p>
        <p>(Chat history will appear here)</p>
      </div>
      <button className="logout-btn" onClick={handleLogout}>🔒 Logout</button>
    </div>
  );
}
