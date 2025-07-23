const express = require("express");
const router = express.Router();
const {
  sendMessage,
  createUser,
  createChat,
  getChats,
  getMessages,
} = require("../controllers/chatController");

router.post("/user", createUser);
router.post("/", createChat);
router.get("/:userId", getChats);
router.get("/:chatId/messages", getMessages);
router.post("/:chatId/message", sendMessage);

module.exports = router;
