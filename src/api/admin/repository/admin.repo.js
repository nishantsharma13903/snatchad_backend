const logger = require("@/utils/logger/logger.utils");
const Admin = require("../model/admin.model");
const { comparePlainText } = require("@/utils/security/hash.utils");

exports.checkAdminExists = async (email) => {
  try {
    return await Admin.findOne({ email });
  } catch (error) {
    logger.error("Error", error);
  }
};

exports.verifyAdmin = async ( plainPassword, hashedPassword) => {
  try {
    return await comparePlainText(plainPassword, hashedPassword);
  } catch (error) {
    logger.error("Error", error);
  }
};

exports.getAdminDetails = async () => {
  try {
    const admin = await Admin.findOne({}).lean();
    return admin;
  } catch (error) {
    logger.error("Error", error);
  }
};

exports.getAdminProfile = async () => {
  try {
    const admin = await Admin.findOne({}).select("-password").lean();
    return admin;
  } catch (error) {
    logger.error("Error", error);
  }
};



exports.updateAdminPassword = async (hashedPassword) => {
  try {
    return await Admin.findOneAndUpdate(
      {},
      {
        $set: {
          password: hashedPassword,
        },
      },
      {
        new: true,
      }
    );
  } catch (error) {
    logger.error("Error", error);
  }
};
