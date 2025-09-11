// src/queue/index.js
const { Queue, Worker } = require("bullmq");
const redis = require("../../utils/redis");


const swipeQueue = new Queue("swipeQueue", { connection : redis });

module.exports = { connection, swipeQueue, Worker };
