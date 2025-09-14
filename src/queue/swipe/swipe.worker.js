// src/queue/swipe/swipe.worker.js
const { Worker } = require("bullmq");
const { connection } = require("./index");
const swipeRepo = require("@/api/swipe/repository/swipe.repo");
const Match = require("@/api/chat/model/match.model");
const mongoose = require("mongoose");

const swipeWorker = new Worker(
  "swipeQueue",
  async (job) => {
    const { userId, targetId, action, ts } = job.data;

    console.log(`Processing swipe job: ${userId} -> ${targetId} (${action})`);

    // 1️⃣ Save swipe in Mongo
    const swipe = await swipeRepo.createSwipe({
      userId,
      targetId,
      action,
      status: "completed",
      createdAt: ts,
    });

    // 2️⃣ If it's a like, check if target already liked user → match
    if (action === "like") {
      const reverseSwipe = await swipeRepo.findSwipe(targetId, userId);

      if (reverseSwipe && reverseSwipe.action === "like") {
        console.log("🎉 Mutual match detected!");

        // always keep ordering consistent
        const [userA, userB] =
          userId.toString() < targetId.toString()
            ? [userId, targetId]
            : [targetId, userId];

        // upsert match
        await Match.findOneAndUpdate(
          { userA, userB },
          {
            $setOnInsert: { userA, userB },
            $set: { mutualSwipe: true },
          },
          { upsert: true, new: true }
        );

        // TODO: trigger notification ("It’s a match!")
      }
    }

    return swipe;
  },
  { connection, concurrency: 20 }
);

swipeWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

swipeWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed`, err);
});

module.exports = swipeWorker;
