// src/controllers/chat.controller.js
const ResponseHandler = require("@/utils/response/responseHandler.utils");
const chatService = require("../services/chat.service");

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const sender = req.token._id;

    const { message } = await chatService.sendMessage(sender, receiver, content);

    return ResponseHandler.success(res, "Message sent", 200, message);
  } catch (err) {
    return ResponseHandler.error(res, err.message, 400, {});
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatId, page = 1, limit = 20 } = req.query;

    const messages = await chatService.fetchMessages(chatId, page, limit);

    return ResponseHandler.success(res, "Messages fetched", 200, messages);
  } catch (err) {
    return ResponseHandler.error(res, err.message, 400, {});
  }
};