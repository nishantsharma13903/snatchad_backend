// src/queue/swipe/swipe.worker.js
const { Worker } = require("bullmq");
const { connection } = require("../index");
const swipeRepo = require("../../repositories/swipe.repository");
const Match = require("../../models/Match"); // hypothetical model

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
        console.log("🎉 Match detected!");
        await Match.create({
          users: [userId, targetId],
          createdAt: new Date(),
        });
        // TODO: trigger notification service
      }
    }

    return swipe;
  },
  { connection, concurrency: 20 } // control load on Mongo
);

swipeWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

swipeWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed`, err);
});

module.exports = swipeWorker;
