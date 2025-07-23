import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // ✅ block redirect until loaded
  const router = useRouter();

  useEffect(() => {
    // ✅ Wait until window is defined (browser only)
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("chat-user-id");
      if (userId) {
        router.replace("/chat");
      } else {
        setLoading(false); // ✅ show login form now
      }
    }
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) return;

    const res = await fetch("http://localhost:5000/api/chat/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    localStorage.setItem("chat-user-id", data.userId);
    localStorage.setItem("chat-username", username);

    router.push("/chat");
  };

  if (loading) return null; // ✅ prevent flashing form briefly

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
