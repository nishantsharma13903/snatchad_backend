require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtIssuer: process.env.JWT_ISSUER,
  jwtAccessExpiresIn: process.env.ACCESS_JWT_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
  jwtAccessExpiresValue: process.env.ACCESS_JWT_EXPIRES_VALUE || '1',
  jwtRefreshExpiresValue: process.env.REFRESH_JWT_EXPIRES_VALUE || '7',
  jwtAudience: {
    user: process.env.JWT_AUDIENCE_USER,
    admin: process.env.JWT_AUDIENCE_ADMIN
  }
};
