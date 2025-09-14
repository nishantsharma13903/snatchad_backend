// models/Subscription.js
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Starter Pack"
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    billingCycle: { 
      type: String, 
      enum: ["one_time", "monthly", "yearly"], 
      default: "one_time" 
    },
    tokens: { type: Number, default: 0 }, // how many tokens included
    dailyBonusTokens: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
