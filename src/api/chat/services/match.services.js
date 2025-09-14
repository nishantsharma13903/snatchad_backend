const Swipe = require("@/api/swipe/model/swipe.model");
const User = require("@/api/user/model/user.model");
const Match = require('../model/match.model');
const { findMatch, createMatch } = require("../repository/match.repo");

exports.checkAndCreateMatch = async (userA, userB) => {
  // ✅ Ensure both liked each other
  const [aLikesB, bLikesA] = await Promise.all([
    Swipe.findOne({ userId: userA, targetId: userB, action: "like" }),
    Swipe.findOne({ userId: userB, targetId: userA, action: "like" }),
  ]);

  if (!aLikesB || !bLikesA) return null;

  // ✅ Check quiz score conditions
  const [userDocA, userDocB] = await Promise.all([
    User.findById(userA),
    User.findById(userB),
  ]);

  if (!userDocA || !userDocB) return null;

  const aQuizScore = userDocA.profiles.quiz.quizScore || 0;
  const bQuizScore = userDocB.profiles.quiz.quizScore || 0;

  const aThreshold = 60; // or load from quiz definition
  const bThreshold = 60;

  if (aQuizScore < aThreshold || bQuizScore < bThreshold) return null;

  // ✅ Create or fetch Match
  let match = await findMatch(userA, userB);
  if (!match) {
    match = await createMatch(userA, userB);
  }
  return match;
};

exports.upsertMatch = async ({ userA, userB, update }) => {
  try {
    const match = await Match.findOneAndUpdate(
      {
        $or: [
          { userA, userB },
          { userA: userB, userB: userA } // order-agnostic
        ]
      },
      { $set: update },
      { upsert: true, new: true }
    );

    return match;
  } catch (err) {
    throw new Error("Match update failed: " + err.message);
  }
};