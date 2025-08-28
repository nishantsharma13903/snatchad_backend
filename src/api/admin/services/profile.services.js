const {
  getAdminDetails,
  updateAdminPassword,
  getAdminProfile,
} = require("@/api/admin/repository/admin.repo");
const { blacklistBothTokens } = require("@/helpers/token/jwt.helper");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");
const {
  hashPlainText,
  comparePlainText,
} = require("@/utils/security/hash.utils");

exports.updateAdminPassword = async (
  newPassword,
  oldPassword,
  userAgent,
  ipAddress
) => {
  try {
    // Password can't be same
    if (oldPassword === newPassword) {
      return ResponseHandler.result(
        400,
        false,
        "Old Password is same as new password.",
        {}
      );
    }

    // Check Is Admin Exist
    const admin = await getAdminDetails();

    if (!admin) {
      return ResponseHandler.result(404, false, "Admin not found", {});
    }

    const adminId = admin?._id;

    const isPasswordMatch = await comparePlainText(oldPassword, admin.password);

    if (!isPasswordMatch) {
      return ResponseHandler.result(400, false, "Incorrect Old Password.", {});
    }

    const hashedPassword = await hashPlainText(newPassword);

    const result = await updateAdminPassword(hashedPassword);

    if (!result) {
      return ResponseHandler.result(
        500,
        false,
        "Something Went Wrong while updating password.",
        {}
      );
    }

    await blacklistBothTokens(adminId);

    return ResponseHandler.result(
      200,
      true,
      "Admin Password updated successfully ",
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

exports.getAdminProfile = async () => {
  try {
    // Check Is Admin Exist
    const admin = await getAdminProfile();

    if (!admin) {
      return ResponseHandler.result(404, false, "Admin not found", {});
    }

    return ResponseHandler.result(
      200,
      true,
      "Admin profile fetched successfully ",
      admin
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
