const bcrypt = require("bcryptjs");
const logger = require("../logger/logger.utils");
require("dotenv").config();

const saltRounds = process.env.BCRYPT_SALT_ROUND;

exports.hashPlainText = async (plainText) => {
  try {
    const salt = await bcrypt.genSalt(Number(saltRounds));
    const hashedText = await bcrypt.hash(String(plainText), salt);
    return hashedText;
  } catch (error) {
    logger.info(error);
  }
};


exports.comparePlainText = async (plainText, hashedText) => {
  return await bcrypt.compare(plainText, hashedText);
};
