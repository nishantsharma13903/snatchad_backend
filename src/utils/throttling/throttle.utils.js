const { incrementKeyInRedis, expireKeyInRedis } = require("@/repository/redis/redis.repository");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.applyThrottlingRules = async (keyRules = []) => {
  for (const { key, limit, window, errorMessage } of keyRules) {
    const count = await incrementKeyInRedis(key);
    if (count === 1) {
      await expireKeyInRedis(key, window);
    }
    if (count > limit) {
    return ResponseHandler.result(
      429,
      false,
      errorMessage || "Too many requests, please try again later.",
      {}
    );
    }
  }

  return ResponseHandler.result(200, true, "Throttling passed", {});
};