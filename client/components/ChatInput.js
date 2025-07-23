import { useState } from "react";

export default function ChatInput({ onSend, isStreaming, onStop }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Type your message..."
      />
      <button onClick={handleSubmit}>Send</button>
      {isStreaming && <button onClick={onStop}>Stop</button>}
    </div>
  );
}
