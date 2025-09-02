const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true },
    type: { type: String, enum: ["YES_NO", "MULTIPLE_CHOICE"], required: true },
    options: {
      type: [String], // YES_NO -> exactly 2; MULTIPLE_CHOICE -> 1..6
      validate: {
        validator: function (arr) {
          if (this.type === "YES_NO") return Array.isArray(arr) && arr.length === 2;
          if (this.type === "MULTIPLE_CHOICE") return Array.isArray(arr) && arr.length >= 1 && arr.length <= 6;
          return false;
        },
        message: "Invalid options count for question type.",
      },
      default: undefined,
    },
    correctAnswers: {
      type: [Number], // index(es) into options
      required: true,
      validate: {
        validator: function (arr) {
          if (!Array.isArray(arr) || arr.length < 1) return false;
          // all indexes must be within options length
          return arr.every(i => Number.isInteger(i) && i >= 0 && i < (this.options?.length || 0));
        },
        message: "correctAnswers must be valid option indexes.",
      },
    },
    points: { type: Number, min: 0, default: 1 },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Draft", "Active", "Deleted"], default: "Active" },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
