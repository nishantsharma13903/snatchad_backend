// src/routes/chat.routes.js
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const { verifyToken } = require("@/middlewares/jwt.middleware");
const { jwtAudience } = require("@/config/jwt/jwt.config");

router.post("/chat/send", verifyToken(jwtAudience.user), chatController.sendMessage);
router.get("/chat/messages", verifyToken(jwtAudience.user), chatController.getMessages);

module.exports = router;
