const logger = require("@/utils/logger/logger.utils");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.verifyGoogleIdToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const userData = {
      email: payload.email,
      fullName: payload.name,
      profilePhoto: payload.picture,
      isEmailVerified: payload.email_verified,
      sub: payload.sub,
    };

    return userData;
  } catch (error) {
    logger.info("Error in Verify Token", error);
  }
};
