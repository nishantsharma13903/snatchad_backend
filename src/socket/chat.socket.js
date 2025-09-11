const { Server } = require("socket.io");
const redisAdapter = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const chatService = require("../services/chat.service");

module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  // Redis adapter for scaling
  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();
  io.adapter(redisAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // Join chat room
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`📥 ${socket.id} joined chat ${chatId}`);
    });

    // Handle sending message
    socket.on("send_message", async ({ sender, receiver, content }) => {
      try {
        const { chat, message } = await chatService.sendMessage(
          sender,
          receiver,
          content
        );

        // Emit to chat room
        io.to(chat._id.toString()).emit("new_message", message);
      } catch (err) {
        socket.emit("error", err.message);
      }
    });

    /**
     * Typing Events
     * --------------------------------------------------
     * "typing" → when user starts typing
     * "stop_typing" → when user stops typing
     * Broadcasted only within the chat room
     */
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", { userId });
    });

    socket.on("stop_typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("stop_typing", { userId });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};
