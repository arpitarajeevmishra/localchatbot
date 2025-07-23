import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
}
