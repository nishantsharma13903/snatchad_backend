// src/api/user/repository/redis.repository.js
const redis = require("@config/redis/redisClient.config"); // Adjust the import path as per your setup

exports.setKeyInRedis = async (key, value, ttlInSec) => {
    console.log(`Setting key in Redis: ${key}, TTL: ${ttlInSec} seconds = ${value}`);
  return await redis.set(key, value, "EX", ttlInSec);
};

exports.getKeyFromRedis = async (key) => {
  return await redis.get(key);
};

exports.deleteKeyFromRedis = async (key) => {
  return await redis.del(key);
};

exports.keyExistsInRedis = async (key) => {
  const exists = await redis.exists(key);
  return exists === 1;
};

exports.setJSONInRedis = async (key, obj, ttlInSec) => {
  const str = JSON.stringify(obj);
  return await redis.set(key, str, "EX", ttlInSec);
};

exports.getJSONFromRedis = async (key) => {
  const str = await redis.get(key);
  return str ? JSON.parse(str) : {};
};

exports.incrementKeyInRedis = async (key) => {
  const count = await redis.incr(key);
  return count;
}

exports.expireKeyInRedis = async (key, ttlInSec) => {
  return await redis.expire(key, ttlInSec);
}