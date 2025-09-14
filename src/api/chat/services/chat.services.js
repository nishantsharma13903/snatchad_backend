// src/services/chat.service.js
const chatRepo = require("../repositories/chat.repository");
const Match = require("../models/Match");
const chatPermissionService = require('./chatPermission.services')

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

const { findOrCreateChat, saveMessage } = require("../repository/chat.repo");
const { checkAndCreateMatch } = require("./match.service");

exports.sendMessage = async (sender, receiver, content) => {
  // ✅ Ensure match exists
  const match = await checkAndCreateMatch(sender, receiver);
  if (!match) {
    throw new Error("No valid match found. Cannot send messages.");
  }

  // ✅ Find or create chat
  const chat = await findOrCreateChat(sender, receiver);

  // ✅ Save message
  const message = await saveMessage(chat._id, sender, receiver, content);

  return { chat, message };
};


exports.fetchMessages = async (chatId, page, limit) => {
  return chatRepo.getMessages(chatId, page, limit);
};

exports.startChat = async (senderId, receiverId, content) => {
  const { allowed, reason } = await chatPermissionService.canUserMessage(senderId, receiverId);
  if (!allowed) throw new Error(`Not allowed to chat: ${reason}`);

  const chat = await chatRepository.findOrCreateChat(senderId, receiverId);
  const message = await chatRepository.saveMessage(chat._id, senderId, receiverId, content);

  return { chat, message };
};
