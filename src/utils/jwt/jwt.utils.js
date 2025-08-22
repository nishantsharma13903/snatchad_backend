const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const signAsync = promisify(jwt.sign);
const {
  jwtSecret,
  jwtIssuer,
  jwtAccessExpiresIn,
  jwtRefreshExpiresIn,
} = require("../../config/jwt/jwt.config");
const {v4 : uuidv4} = require("uuid");

exports.generateAccessToken = async (payload, audience) => {
  const { expires_in, ...data } = payload;

  return await signAsync(data, jwtSecret, {
    expiresIn: expires_in || jwtAccessExpiresIn,
    issuer: jwtIssuer,
    audience,
  });
};

exports.generateAuthJWT = async (payload, audience) => {
  const data = payload;

  return {
    accessToken: await signAsync({...data, jti: uuidv4(), tokenType : "access"}, jwtSecret, {
      expiresIn:  jwtAccessExpiresIn || '1h',
      issuer: jwtIssuer,
      audience,
    }),
    refreshToken: await signAsync({...data, jti: uuidv4(), tokenType : "refresh"}, jwtSecret, {
      expiresIn: jwtRefreshExpiresIn || '7d',
      issuer: jwtIssuer,
      audience,
    }),
  };
};

exports.verifyToken = async (token) => {
  try {
    return await promisify(jwt.verify)(token, jwtSecret);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};