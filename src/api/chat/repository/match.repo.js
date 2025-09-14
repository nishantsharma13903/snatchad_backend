const Match = require("../models/match.model");

exports.findMatch = async (userA, userB) => {
  return Match.findOne({
    users: { $all: [userA, userB] },
    isActive: true,
  });
};

exports.createMatch = async (userA, userB) => {
  return Match.create({ users: [userA, userB] });
};
