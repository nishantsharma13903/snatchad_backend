const logger = require("@/utils/logger/logger.utils");
const { generateOTP } = require("@/utils/otp/otp.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");
const { sendOtpOnPhone } = require("@/utils/otp/sendOtp.utils");
const {
  createOTP,
  verifyOTP,
  throttleOtpSend,
  throttleOtpVerification,
} = require("./otp.services");
const {
  createNewUser,
  getUserByPhone,
  checkUserExistByPhone,
} = require("../repository/user.repository");
const { generateAuthJWT } = require("@/utils/jwt/jwt.utils");
const { jwtAudience } = require("@/config/jwt/jwt.config");
const { notificationToAll } = require("@/config/firebase/notification.config");
const {
  hashPlainText,
  comparePlainText,
} = require("@/utils/security/hash.utils");
const { jwtRefreshExpiresValue } = require("@/config/jwt/jwt.config");
const { verifyToken } = require("@/utils/jwt/jwt.utils");

const {
  setKeyInRedis,
  deleteKeyFromRedis,
  setJSONInRedis,
  getJSONFromRedis,
} = require("@/repository/redis/redis.repository");
const {
  issueTokens,
  blacklistBothTokens,
} = require("@/helpers/token/jwt.helper");

/*
-----------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------
 Services
-----------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------- 
*/

// Create and send OTP
exports.sendOTP = async (phone) => {
  try {
    // Call OTP throttling logic
    const throttlingResult = await throttleOtpSend(phone);

    if (!throttlingResult.success) {
      return ResponseHandler.result(
        throttlingResult.status,
        throttlingResult.success,
        throttlingResult.message,
        throttlingResult.result
      );
    }

    const { result } = generateOTP();

    const { otp, expiresAt } = result;

    if (!otp || !expiresAt) {
      return ResponseHandler.result(500, false, "Failed to generate OTP.", {});
    }

    const otpResult = await createOTP(phone, otp, expiresAt);

    if (!otpResult.success) {
      return ResponseHandler.result(500, false, "Failed to save OTP.", {});
    }

    // OTP send function called
    await sendOtpOnPhone();

    return ResponseHandler.result(200, true, `OTP sent successfully`, {
      otp,
      expiresAt,
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

// Verify OTP
exports.verifyOTP = async (phone, otp, mode,userAgent, ipAddress) => {
  try {
    // OTP verification throttling logic
    const throttlingResult = await throttleOtpVerification(phone);

    if (!throttlingResult.success) {
      return ResponseHandler.result(
        throttlingResult.status,
        throttlingResult.success,
        throttlingResult.message,
        throttlingResult.result
      );
    }

    const verifyOTPResult = await verifyOTP(phone, otp);

    if (!verifyOTPResult.success) {
      return ResponseHandler.result(
        verifyOTPResult.status,
        verifyOTPResult.success,
        verifyOTPResult.message,
        verifyOTPResult.result
      );
    }

    // Check Is User Exist
    const isUserExist = await checkUserExistByPhone(phone);

    if (!isUserExist) {
      // Registration
      return await handleRegistration(phone,mode, userAgent, ipAddress);
    } else {
      // Login
      return await handleManualLogin(phone,mode, userAgent, ipAddress);
    }
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

// Logout User
exports.logOutUser = async (userId, incomingToken, userAgent, ipAddress) => {
  try {
    if (!userId) {
      return ResponseHandler.result(400, false, "User ID is required.", {});
    }

    const token = incomingToken?.split(" ")[1];

    if (!token) {
      return ResponseHandler.result(400, false, "Token is required.", {});
    }

    const decodedToken = await verifyToken(token);

    if (!decodedToken || decodedToken._id !== userId) {
      return ResponseHandler.result(401, false, "Invalid token.", {});
    }

    const jti = decodedToken.jti;
    const now = Math.floor(Date.now() / 1000);
    const expiry = decodedToken.exp;
    const ttl = expiry - now; // time to live

    if (ttl > 0 && jti) {
      // await redis.set(`bl:${jti}`, "blacklisted", "EX", ttl); // key expires when token would
      await setKeyInRedis(`bl:${jti}`, "blacklisted", ttl); // key expires when token would
    }

    // Remove refresh token from Redis
    // await redis.del(`refreshToken:${userId}`);
    await deleteKeyFromRedis(`refreshToken:${userId}`);

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

// Refresh Auth Tokens
exports.generateNewAuthTokens = async (
  userId,
  incomingRefreshToken,
  userAgent,
  ipAddress
) => {
  try {
    if (!userId || !incomingRefreshToken) {
      return ResponseHandler.result(
        400,
        false,
        "User ID and refresh token are required.",
        {}
      );
    }

    // Get the stored token from Redis
    const refreshTokenResult = await getJSONFromRedis(`refreshToken:${userId}`);
    if (!refreshTokenResult) {
      return ResponseHandler.result(
        401,
        false,
        "Refresh token not found or expired. Please log in again.",
        {}
      );
    }

    const parsedToken = refreshTokenResult;
    const oldRefreshTokenHash = parsedToken.token;

    // Check if the provided token matches the stored hashed token
    const isTokenValid = await comparePlainText(
      incomingRefreshToken,
      oldRefreshTokenHash
    );
    if (!isTokenValid) {
      return ResponseHandler.result(
        401,
        false,
        "Invalid refresh token. Please log in again.",
        {}
      );
    }

    // Blacklist old access token if jti/exp is stored
    const accessJti = parsedToken?.accessTokenDetail?.accessJti;
    const accessExp = parsedToken?.accessTokenDetail?.accessExp;

    if (accessJti && accessExp) {
      const ttl = accessExp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        // await redis.set(`bl:${accessJti}`, "blacklisted", "EX", ttl);
        await setKeyInRedis(`bl:${accessJti}`, "blacklisted", ttl);
      }
    }

    // Blacklist the old refresh token
    const refreshJti = parsedToken?.refreshTokenDetail?.refreshJti;
    const refreshExp = parsedToken?.refreshTokenDetail?.refreshExp;
    if (refreshJti && refreshExp) {
      const ttl = refreshExp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await setKeyInRedis(`bl:${refreshJti}`, "blacklisted", ttl);
      }
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken } = await generateAuthJWT(
      { _id: userId },
      jwtAudience.user
    );

    const hashedNewRefreshToken = await hashPlainText(refreshToken);

    // Decode new access token to get its jti and exp
    const decodedAccessToken = await verifyToken(accessToken);
    const newAccessJti = decodedAccessToken.jti;
    const newAccessExp = decodedAccessToken.exp;

    // Decode new refresh token to get its jti and exp
    const decodedRefreshToken = await verifyToken(refreshToken);
    const newRefreshJti = decodedRefreshToken.jti;
    const newRefreshExp = decodedRefreshToken.exp;

    // Save new refresh token in Redis (rotate)
    await setJSONInRedis(
      `refreshToken:${userId}`,
      {
        token: hashedNewRefreshToken,
        userAgent,
        ipAddress,
        createdAt: new Date(),
        expiresAt: new Date(
          Date.now() + jwtRefreshExpiresValue * 24 * 60 * 60 * 1000
        ),
        accessTokenDetail: {
          accessJti: newAccessJti,
          accessExp: newAccessExp,
        },
        refreshTokenDetail: {
          refreshJti: newRefreshJti,
          refreshExp: newRefreshExp,
        },
      },
      jwtRefreshExpiresValue * 24 * 60 * 60 // Store in seconds
    );

    return ResponseHandler.result(200, true, "Tokens refreshed successfully.", {
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

/*
-----------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------
 Methods
-----------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------- 
*/

// Handle Registration
const handleRegistration = async (phone,mode, userAgent, ipAddress) => {
  const userData = {
    status: "Active",
    phone: phone,
    isPhoneVerified: true,
  };

  const newUser = await createNewUser(userData);
  const savedUser = await newUser.save();
  if (!savedUser)
    return ResponseHandler.result(500, false, "User creation failed", {});

  const { accessToken, refreshToken } = await issueTokens(
    savedUser._id,
    jwtAudience.user,
    userAgent,
    ipAddress
  );

  await deleteKeyFromRedis(`otp:${phone}`); // Clean up OTP from Redis

  return ResponseHandler.result(200, true, "Registration successful", {
    userDetail: {
      _id: savedUser._id,
      phone: savedUser.phone,
      email: savedUser.email,
      // profileStep: savedUser.profileStep,
      mode: "quiz", // tell frontend which mode to continue
      profileStep: savedUser.profiles.quiz.profileStep || "dob",
    },
    accessToken,
    refreshToken,
  });
};

// Handle Login
const handleManualLogin = async (phone,mode, userAgent, ipAddress) => {
  const user = await getUserByPhone(phone, "userName email phone _id profiles");

  // blacklist the previous token
  await blacklistBothTokens(user._id);

  const { accessToken, refreshToken } = await issueTokens(
    user._id,
    jwtAudience.user,
    userAgent,
    ipAddress
  );

  await deleteKeyFromRedis(`otp:${phone}`); // Clean up OTP from Redis

  console.log("user?.profiles[mode]?.profileStep",mode, user.profiles);
  console.log("user?.profiles[mode]?.profileStep",user?.profiles[mode]?.profileStep)


  return ResponseHandler.result(200, true, "Login successful", {
    userDetail: {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      // profileStep: user.profileStep,
      mode,
      profileStep: user?.profiles[mode]?.profileStep || "dob",
    },
    accessToken,
    refreshToken,
  });
};
