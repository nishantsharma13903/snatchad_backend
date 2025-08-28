const logger = require("@utils/logger/logger.utils");
const User = require("../model/user.model");

exports.checkUserNameExist = async (userName) => {
  try {
    const result = await User.exists({ userName });
    return !!result; // returns true if found, false otherwise
  } catch (error) {
    logger.error("Error checking username existence:", error);
    throw error;
  }
};

exports.checkReferralCodeExist = async (refCode) => {
  try {
    const result = await User.exists({ referralCode: refCode });
    console.log("respo", result);
    return !!result; // returns true if found, false otherwise
  } catch (error) {
    logger.error("Error checking username existence:", error);
    throw error;
  }
};

exports.checkUserExist = async (identifier, type) => {
  try {
    let result = false;
    if (type === "email") {
      result = await User.exists({ email: identifier });
    } else if (type === "phone") {
      result = await User.exists({ phone: identifier });
    }

    return !!result; // returns true if found, false otherwise
  } catch (error) {
    logger.error("Error checking existence:", error);
    throw error;
  }
};

exports.checkUserExistByPhone = async (phone) => {
  try {
    let result = false;
    result = await User.exists({ phone: phone });

    return !!result; // returns true if found, false otherwise
  } catch (error) {
    logger.error("Error checking existence:", error);
    throw error;
  }
};

exports.createNewUser = async (userData) => {
  try {
    const newUser = new User(userData);
    return await newUser.save();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.updateUser = async (userId, payload) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $set: payload,
      },
      { new: true }
    );
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getUserByPhone = async (phone, selectedFields) => {
  try {
    let result = {};

    result = await User.findOne({ phone: phone })
      .select(selectedFields)
      .lean();

    return result;
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getProfileStep = async (userId) => {
  try {
    const user = await User.findById(userId, "profileStep");
    if (!user) throw new Error("User not found");
    return user.profileStep;
  } catch (error) {
    logger.error("Error : ", error);
  }
};

exports.getUserById = async (userId, selectedFields) => {
  try {
    return await User.findOne({ _id: userId }).select(selectedFields).lean();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};

exports.getUserByReferralCode = async (referralCode, selectedFields) => {
  try {
    return await User.findOne({ referralCode }).select(selectedFields).lean();
  } catch (error) {
    logger.error("Error", error);
    throw error;
  }
};
