const {
  createActivityLog,
} = require("@/api/v1/activityLogs/repository/activityLog.repo");
const {
  getAdminDetails,
  verifyAdmin,
} = require("@/api/admin/repository/admin.repo");
const { limits, window } = require("@/config/admin/admin.config");
const { jwtAudience } = require("@/config/jwt/jwt.config");
const {
  issueTokens,
  blacklistBothTokens,
} = require("@/helpers/token/jwt.helper");
const {
  deleteKeyFromRedis,
  setKeyInRedis,
} = require("@/repository/redis/redis.repository");
const { verifyToken } = require("@/utils/jwt/jwt.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");
const { applyThrottlingRules } = require("@/utils/throttling/throttle.utils");

// Services

exports.verifyLoginCredentails = async (
  email,
  password,
  userAgent,
  ipAddress
) => {
  try {
    // Check Is Admin Exist
    const admin = await getAdminDetails();

    if (!admin) {
      return ResponseHandler.result(404, false, "Admin not found", {});
    }

    if(admin.email !== email){
      return ResponseHandler.result(401, false, "Invalid credentails.", {})
    }

    const adminId = admin?._id;

    // Credentials verification throttling logic

    const throttleResult = await applyThrottlingRules([
      {
        key: `admin:login:sec:${adminId}`,
        limit: limits.verifyLimit30S,
        window: window.verifyWindow30S,
        errorMessage: `Too many requests, please try again later after ${window.verifyWindow30S} seconds.`,
      },
      {
        key: `admin:login:hour:${adminId}`,
        limit: limits.verifyLimitHour,
        window: window.verifyWindowHour,
        errorMessage: `Too many requests, please try again later after ${
          window.verifyWindowHour / 60
        } minutes.`,
      },
      {
        key: `admin:login:day:${adminId}`,
        limit: limits.verifyLimitDay,
        window: window.verifyWindowDay,
        errorMessage: `Too many requests, please try again later after ${
          window.verifyWindowDay / 3600
        } hours.`,
      },
    ]);

    if (!throttleResult.success) {
      return ResponseHandler.result(
        throttleResult.statusCode,
        false,
        throttleResult.message || "Throttling failed",
        {}
      );
    }

    const result = await verifyAdmin(password, admin.password);

    if (!result) {
      return ResponseHandler.result(400, false, "Invalid credentials", {});
    }

    await blacklistBothTokens(adminId);

    const { accessToken, refreshToken } = await issueTokens(
      admin._id,
      jwtAudience.admin,
      userAgent,
      ipAddress,
    );

    return ResponseHandler.result(200, true, "Admin successfully loggedIn", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.logOutAdmin = async (adminId, incomingToken, userAgent, ipAddress) => {
  try {
    if (!adminId) {
      return ResponseHandler.result(400, false, "Admin ID is required.", {});
    }

    const token = incomingToken?.split(" ")[1];

    if (!token) {
      return ResponseHandler.result(400, false, "Token is required.", {});
    }

    const decodedToken = await verifyToken(token);

    if (!decodedToken || decodedToken._id !== adminId) {
      return ResponseHandler.result(401, false, "Invalid token.", {});
    }

    const jti = decodedToken.jti;
    const now = Math.floor(Date.now() / 1000);
    const expiry = decodedToken.exp;
    const ttl = expiry - now; // time to live

    if (ttl > 0 && jti) {
      await setKeyInRedis(`bl:${jti}`, "blacklisted", ttl); // key expires when token would
    }

    // Remove refresh token from Redis
    await deleteKeyFromRedis(`refreshToken:${adminId}`);

    return ResponseHandler.result(
      200,
      true,
      "User logged out successfully.",
      {}
    );
  } catch (error) {
    logger.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};