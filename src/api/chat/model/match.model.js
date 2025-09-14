// models/Match.js
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    userA: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userB: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // conditions
    mutualSwipe: { type: Boolean, default: false },
    quizPassed: { type: Boolean, default: false },

    // metadata
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

matchSchema.index({ userA: 1, userB: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);
