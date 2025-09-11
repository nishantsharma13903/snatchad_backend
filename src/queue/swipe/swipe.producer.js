// // src/queue/swipe.producer.js
// const { swipeQueue } = require("./index");

// async function enqueueSwipeJob(swipeData) {
//   await swipeQueue.add("swipe", swipeData, {
//     attempts: 3, // retry if worker fails
//     backoff: { type: "exponential", delay: 2000 },
//   });
// }

// module.exports = { enqueueSwipeJob };


// src/queue/swipe/swipe.producer.js
const { Queue } = require("bullmq");
const { connection } = require("./index"); // Redis connection config

const swipeQueue = new Queue("swipeQueue", { connection });

async function enqueueSwipeJob(payload) {
  await swipeQueue.add("swipe", payload, {
    attempts: 3,   // retry if worker fails
    backoff: 5000, // wait 5s before retry
    removeOnComplete: true,
    removeOnFail: false,
  });
}

module.exports = { enqueueSwipeJob, swipeQueue };