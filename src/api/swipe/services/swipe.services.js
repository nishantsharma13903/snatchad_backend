// src/services/swipe.service.js
const { createSwipe } = require("@/api/swipe/repository/swipe.repo");
const { enqueueSwipeJob } = require("@/queue/swipe/swipe.producer");

exports.handleSwipe = async(userId, targetId, action) => {
  // 1. Write pending record to Mongo immediately
  const swipe = await createSwipe({
    userId,
    targetId,
    action,
    status: "pending",
  });

  // 2. Enqueue job for background processing
  await enqueueSwipeJob({ swipeId: swipe._id });

  // 3. Return pending swipe to API
  return swipe;
}

exports.handleSwipe = async(userId, targetId, action) => {
  // Just push to Redis (with timestamp)
  await enqueueSwipeJob({
    userId,
    targetId,
    action,
    ts: Date.now(),
  });

  return {}
}