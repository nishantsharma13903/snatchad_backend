const jwt = require("jsonwebtoken");
const { jwtSecret, jwtIssuer } = require("../config/jwt/jwt.config");
const logger = require("../utils/logger/logger.utils");
const redis = require("../config/redis/redisClient.config");

exports.verifyToken = (expectedAudience) => {
  return async (req, res, next) => {
    try {
      if (expectedAudience) {
      }

      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res.json({
          statusCode: 401,
          success: false,
          message: "Authorization header missing",
          result: {},
        });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.json({
          statusCode: 401,
          success: false,
          message: "Token is missing",
          result: {},
        });
      }

      const decoded = jwt.verify(token, jwtSecret, {
        issuer: jwtIssuer,
        audience: expectedAudience,
      });

      if(!decoded){
         return res.json({
          statusCode: 401,
          success: false,
          message: "Invalid token.",
          result: {},
        });
      }

      const isBlacklisted = await redis.get(`bl:${decoded.jti}`);

      if (isBlacklisted) {
        return res.json({
          statusCode: 401,
          success: false,
          message: "Token is blacklisted",
          result: {},
        });
      }

      req.token = decoded;
      next();
    } catch (error) {
      logger.error("JWT Verification Error:", error);

      const message =
        error.name === "TokenExpiredError"
          ? "Token expired"
          : error.name === "JsonWebTokenError"
          ? "Invalid token"
          : "Unauthorized";

      return res.json({ statusCode: 401, success: false, message, result: {} });
    }
  };
};
