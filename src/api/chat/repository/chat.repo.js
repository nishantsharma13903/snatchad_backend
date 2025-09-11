// src/repositories/chat.repository.js
const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.findOrCreateChat = async (userA, userB) => {
  let chat = await Chat.findOne({ participants: { $all: [userA, userB] } });
  if (!chat) {
    chat = await Chat.create({ participants: [userA, userB] });
  }
  return chat;
};

exports.saveMessage = async (chatId, sender, receiver, content) => {
  const message = await Message.create({ chatId, sender, receiver, content });
  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });
  return message;
};

exports.getMessages = async (chatId, page = 1, limit = 20) => {
  return Message.find({ chatId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};
