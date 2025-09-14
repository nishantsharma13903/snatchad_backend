// services/chatPermission.service.js
const Match = require("../model/match.model");

exports.canUserMessage = async (senderId, receiverId) => {
  const match = await Match.findOne({
    $or: [
      { userA: senderId, userB: receiverId },
      { userA: receiverId, userB: senderId },
    ],
  });

  if (!match) return { allowed: false, reason: "no_match" };

  if (match.mutualSwipe || match.quizPassed) {
    return { allowed: true, reason: match.mutualSwipe ? "mutual_swipe" : "quiz_passed" };
  }

  return { allowed: false, reason: "conditions_not_met" };
};
