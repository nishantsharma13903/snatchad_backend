const Redis = require("ioredis");
const logger = require("../../utils/logger/logger.utils");

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
  db: 0,
  password : process.env.REDIS_PASSWORD || null,
});

redis.on("connect", () => {
  logger.info("✅ Redis connected successfully");
});

redis.on("error", (err) => {
  logger.error("😔 Redis connection error:", err);
});

module.exports = redis;
