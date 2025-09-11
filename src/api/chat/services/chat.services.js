// src/services/chat.service.js
const chatRepo = require("../repositories/chat.repository");
const Match = require("../models/Match");

exports.sendMessage = async (sender, receiver, content) => {
  // ✅ Verify they are matched
  const match = await Match.findOne({
    users: { $all: [sender, receiver] },
  });

  if (!match) throw new Error("Users are not matched!");

  // ✅ Get or create chat
  const chat = await chatRepo.findOrCreateChat(sender, receiver);

  // ✅ Save message
  const message = await chatRepo.saveMessage(chat._id, sender, receiver, content);

  return { chat, message };
};

exports.fetchMessages = async (chatId, page, limit) => {
  return chatRepo.getMessages(chatId, page, limit);
};
