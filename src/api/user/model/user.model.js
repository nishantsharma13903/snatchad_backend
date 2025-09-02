const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  url: { type: String, default: "" },
  isPrimary: { type: Boolean, default: false },
  order: { type: Number },
});

const modeSchema = new mongoose.Schema({
  dob: { type: Date, default: null },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  sexuality: {
    type: String,
    default: "",
  },
  height: {
    type: String,
    default: "",
  },
  goals: [{ type: String }],
  interest: {
    type: String,
    default: "",
  },
  // lookingFor: [String],
  relationship: {
    type: String,
    default: "",
  },
  relationShipGoal : {
    type : String,
    default : ""
  },
  kids : {
    type : String,
    default : ""
  },
  languages : {
    type : String,
    default : ""
  },
  smoking : {
    type : String,
    default : ""
  },
  thc : {
    type : String,
    default : ""
  },
  drinking : {
    type : String,
    default : ""
  },
  religion : {
    type : String,
    default : ""
  },
  hobbies: [String],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  photos: {
    type: [photoSchema],
    default: () =>
      Array.from({ length: 6 }, (_, i) => ({
        url: "",
        isPrimary: i === 0, // 👈 first photo can be primary
        order: i + 1, // 👈 keep order 1–6
      })),
  },
  quizScore: { type: Number, default: 0 },
  profileStep: {
    type: String,
    default: "basicDetails",
    enum: [
      "basicDetails",
      "dob",
      "gender",
      "sexuality",
      "height",
      "goals",
      "interest",
      "relationship",
      "hobbies",
      "location",
      "photos",
      // "quiz",
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
