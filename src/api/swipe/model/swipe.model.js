// src/models/Swipe.js
const mongoose = require("mongoose");

const swipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, enum: ["like", "dislike"], required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

swipeSchema.index({ userId: 1, targetId: 1 });

module.exports = mongoose.model("Swipe", swipeSchema);
