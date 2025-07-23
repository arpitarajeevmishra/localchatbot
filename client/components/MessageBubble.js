export default function MessageBubble({ role, content }) {
  return (
    <div className={`message-bubble ${role}`}>
      <p>{content}</p>
    </div>
  );
}
