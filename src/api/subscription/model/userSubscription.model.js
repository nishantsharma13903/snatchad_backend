// models/UserSubscription.js
const mongoose = require("mongoose");

const userSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSubscription", userSubscriptionSchema);
