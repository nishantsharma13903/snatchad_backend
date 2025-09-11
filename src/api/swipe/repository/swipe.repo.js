const Swipe = require('../model/swipe.model');


exports.createSwipe = async (payload) => {
    try {
        const newSwipe = new Swipe(payload);
        return await newSwipe.save();
    } catch (error) {
        console.log("Error", error);
    }
}

exports.findSwipe = async(userId, targetId) => {
  return Swipe.findOne({ userId, targetId }).lean();
}

exports.getSwipedTargetIds = async (userId) => {
  const swipes = await Swipe.find({ userId }).select("targetId").lean();
  return swipes.map((s) => s.targetId.toString());
}

exports.completeSwipe = (swipeId) => {
  return Swipe.findByIdAndUpdate(swipeId, { status: "completed" }, { new: true });
}

exports.createSwipe = async (payload) => {
  try {
    const swipe = new Swipe(payload);
    return await swipe.save();
  } catch (err) {
    console.error("Swipe Repo Error:", err);
    throw err;
  }
};

exports.findSwipe = async (userId, targetId) => {
  return Swipe.findOne({ userId, targetId }).lean();
};

exports.getSwipedTargetIds = async (userId) => {
  const swipes = await Swipe.find({ userId }).select("targetId").lean();
  return swipes.map((s) => s.targetId.toString());
};