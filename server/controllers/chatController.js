const pool = require("../db");
const axios = require("axios");

const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { prompt } = req.body;

  console.log("🛠️ Incoming prompt:", prompt, "Chat ID:", chatId);

  try {
    await pool.query(
      "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
      [chatId, "user", prompt]
    );

    const response = await axios.post(process.env.OLLAMA_URL, {
      model: "gemma:2b",
      prompt,
      stream: false,
    });

    const reply = response.data.response;

    await pool.query(
      "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3)",
      [chatId, "assistant", reply]
    );

    const msgCount = await pool.query(
      "SELECT COUNT(*) FROM messages WHERE chat_id = $1",
      [chatId]
    );

    if (parseInt(msgCount.rows[0].count) === 2) {
      await pool.query("UPDATE chats SET title = $1 WHERE id = $2", [
        prompt.slice(0, 50),
        chatId,
      ]);
    }

    res.json({ message: reply });
  } catch (error) {
    console.error("❌ sendMessage error:", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

const createUser = async (req, res) => {
  const { username } = req.body;
  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existing.rows.length > 0) {
      return res.json({ userId: existing.rows[0].id });
    }

    const result = await pool.query(
      "INSERT INTO users (username) VALUES ($1) RETURNING id",
      [username]
    );

    res.json({ userId: result.rows[0].id });
  } catch (err) {
    console.error("❌ createUser error:", err.message);
    res.status(500).json({ error: "User creation failed" });
  }
};

const createChat = async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO chats (user_id, title) VALUES ($1, $2) RETURNING id",
      [userId, "New Chat"]
    );
    res.json({ chatId: result.rows[0].id });
  } catch (err) {
    console.error("❌ createChat error:", err.message);
    res.status(500).json({ error: "Chat creation failed" });
  }
};

const getChats = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, title FROM chats WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ getChats error:", err.message);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC",
      [chatId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ getMessages error:", err.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

module.exports = {
  sendMessage,
  createUser,
  createChat,
  getChats,
  getMessages,
};