const mongoose = require("mongoose");

const suggestedQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Delete"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const suggestedQuestionModel = mongoose.model(
  "SuggestedQuestion",
  suggestedQuestionSchema
);

module.exports = suggestedQuestionModel;
