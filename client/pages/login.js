import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("chat-username");
    if (stored) router.push("/chat");
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) return;

    localStorage.setItem("chat-username", username);

    const res = await fetch("http://localhost:5000/api/chat/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    localStorage.setItem("chat-user-id", data.userId);

    router.push("/chat");
  };

  return (
    <div className="login-page">
      <h1>⚡ Welcome to CyberChat</h1>
      <input
        type="text"
        placeholder="Enter your hacker alias"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <button onClick={handleLogin}>Enter The Grid</button>
    </div>
  );
}