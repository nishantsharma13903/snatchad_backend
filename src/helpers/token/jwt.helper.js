const { jwtAudience, jwtRefreshExpiresValue } = require("@/config/jwt/jwt.config");
const {
  setKeyInRedis,
  getJSONFromRedis,
  setJSONInRedis,
} = require("@/repository/redis/redis.repository");
const { generateAuthJWT, verifyToken } = require("@/utils/jwt/jwt.utils");
const { hashPlainText } = require("@/utils/security/hash.utils");

// Issue Tokens
exports.issueTokens = async (userId,audience, userAgent, ipAddress) => {
  const { accessToken, refreshToken } = await generateAuthJWT(
    { _id: userId },
    audience
  );

  const hashedToken = await hashPlainText(refreshToken);

  // Decode access token to get its jti and exp
  const decodedAccessToken = await verifyToken(accessToken);
  const accessJti = decodedAccessToken.jti;
  const accessExp = decodedAccessToken.exp;

  // Decode refresh token to get its jti and exp
  const decodedRefreshToken = await verifyToken(refreshToken);
  const refreshJti = decodedRefreshToken.jti;
  const refreshExp = decodedRefreshToken.exp;

  // Save refresh token in Redis
  await setJSONInRedis(
    `refreshToken:${userId}`,
    {
      token: hashedToken,
      accessTokenDetail: {
        accessJti,
        accessExp,
      },
      refreshTokenDetail: {
        refreshJti,
        refreshExp,
      },
      userAgent,
      ipAddress,
      createdAt: new Date(),
      expiresAt: new Date(
        Date.now() + jwtRefreshExpiresValue * 24 * 60 * 60 * 1000
      ),
    },
    jwtRefreshExpiresValue * 24 * 60 * 60 // Store in seconds
  );

  return { accessToken, refreshToken };
};

// helper.js
exports.blacklistTokenIfValid = async (jti, exp) => {
  if (!jti || !exp) return;

  const ttl = exp - Math.floor(Date.now() / 1000);
  if (ttl > 0) {
    await setKeyInRedis(`bl:${jti}`, "blacklisted", ttl);
  }
};

// tokenBlacklistHelper.js
exports.blacklistBothTokens = async (userId) => {
  const parsedToken = await getJSONFromRedis(`refreshToken:${userId}`);
  if (!parsedToken) return;

  const now = Math.floor(Date.now() / 1000);

  const tokens = [
    parsedToken?.accessTokenDetail,
    parsedToken?.refreshTokenDetail,
  ];

  for (const tokenDetail of tokens) {
    const jti = tokenDetail?.accessJti || tokenDetail?.refreshJti;
    const exp = tokenDetail?.accessExp || tokenDetail?.refreshExp;

    if (jti && exp) {
      const ttl = exp - now;
      if (ttl > 0) {
        await setKeyInRedis(`bl:${jti}`, "blacklisted", ttl);
      }
    }
  }
};