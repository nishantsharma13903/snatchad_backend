const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
});

const modeSchema = new mongoose.Schema({
  dob: Date,
  firstName : {
    type : String,
    default : ""
  },
  lastName : {
    type : String,
    default : ""
  },
  identity: {
    type: String,
    enum: ["male", "female", "trans", "non-binary", "other"],
  },
  sexuality: {
    type: String,
    enum: ["straight", "gay", "lesbian", "bisexual", "asexual", "other"],
  },
  height: {
    type : Number,
    default : 0
  },
  goals: [{ type: String }],
  interests: {
    type : String,
    enum : ["Male","Female","Non-Binary","All"]
  },
  lookingFor: [String],
  hobbies: [String],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  photos: [photoSchema],
  quizScore: { type: Number, default: 0 },
  profileStep: {
    type: String,
    default: "dob",
    enum: [
      "dob",
      "identity",
      "sexuality",
      "height",
      "goals",
      "interests",
      "lookingFor",
      "hobbies",
      "location",
      "photos",
      "quiz",
      "completed",
    ],
  },
});

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Blocked"], default: "Active" },

    // ✅ All profile modes
    profiles: {
      quiz: { type: modeSchema, default: () => ({}) },
      snatched: { type: modeSchema, default: () => ({}) },
      versus: { type: modeSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

// Location index (useful if you query by location)
userSchema.index({ "profiles.quiz.location": "2dsphere" });
userSchema.index({ "profiles.snatched.location": "2dsphere" });
userSchema.index({ "profiles.versus.location": "2dsphere" });

module.exports = mongoose.model("User", userSchema);
