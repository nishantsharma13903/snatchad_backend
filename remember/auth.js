const ResponseHandler = require("@utils/response/responseHandler.utils");
const logger = require("@utils/logger/logger.utils");
const { getUserById, updateUser } = require("../repository/user.repository");
const { validateImages } = require("@/helpers/images/images.helper");

exports.getUserDetail = async (userId, mode) => {
  try {
    if (!userId) {
      return ResponseHandler.result(400, false, "User ID is required.", {});
    }

    const user = await getUserById(
      userId,
      "-password -__v -createdAt -updatedAt -refreshToken"
    );

    if (!user) {
      return ResponseHandler.result(404, false, "User not found.", {});
    }

    const profileData = user.profiles?.[mode] || {};

    return ResponseHandler.result(
      200,
      true,
      "User details fetched successfully.",
      {
        userDetail: {
          phone,
          email,
          status,
          ...profileData,
        },
      }
    );
  } catch (error) {
    logger.info(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.getProfileStep = async (userId, mode) => {
  try {
    if (!userId) {
      return ResponseHandler.result(400, false, "User ID is required.", {});
    }

    const user = await getUserById(
      userId,
      "-password -__v -createdAt -updatedAt -refreshToken"
    );

    if (!user) {
      return ResponseHandler.result(404, false, "User not found.", {});
    }

    return ResponseHandler.result(
      200,
      true,
      "User details fetched successfully.",
      { profileStep: user.profileStep }
    );
  } catch (error) {
    logger.info(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.updateProfile = async (userId, updateData) => {
  try {
    let user = await getUserById(userId);
    if (!user) {
      return ResponseHandler.result(404, false, "User not found.", {});
    }

    // Merge fields
    Object.assign(user, updateData);

    // ✅ Step progression logic
    if (
      updateData.firstName &&
      updateData.lastName &&
      user.profileStep === "basicDetails"
    ) {
      user.profileStep = "dob";
    }
    if (updateData.dob && user.profileStep === "dob") {
      user.profileStep = "identity";
    }
    if (
      updateData.identity &&
      updateData.sexuality &&
      user.profileStep === "identity"
    ) {
      user.profileStep = "height";
    }
    if (updateData.height && user.profileStep === "height") {
      user.profileStep = "goals";
    }
    if (updateData.goals && user.profileStep === "goals") {
      user.profileStep = "interests";
    }
    if (
      updateData.interests &&
      updateData.lookingFor &&
      user.profileStep === "interests"
    ) {
      user.profileStep = "hobbies";
    }
    if (updateData.hobbies && user.profileStep === "hobbies") {
      user.profileStep = "location";
    }
    if (updateData.location && user.profileStep === "location") {
      user.profileStep = "photos";
    }
    if (
      updateData.photos &&
      updateData.photos.length >= 6 &&
      user.profileStep === "photos"
    ) {
      user.profileStep = "quiz";
    }
    if (updateData.quizScore && user.profileStep === "quiz") {
      user.profileStep = "completed";
    }

    await updateUser(userId, user);

    return ResponseHandler.result(200, true, "Profile updated successfully.", {
      profileStep: user.profileStep,
    });
  } catch (error) {
    logger.info(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.updatePhotosAndQuiz = async (
  userId,
  files,
  mainPhotoIndex,
  quizScore
) => {
  try {
    // ✅ UserId validation
    if (!userId) {
      return ResponseHandler.result(400, false, "User ID is required.", {});
    }

    // ✅ Must upload exactly 6 photos
    if (!files || files.length !== 6) {
      return ResponseHandler.result(
        400,
        false,
        "You must upload exactly 6 photos.",
        {}
      );
    }

    // ✅ Validate photos (fake/AI detection etc.)
    const validationResults = await validateImages(files.map((f) => f.path));
    if (!validationResults.isValid) {
      return ResponseHandler.result(
        400,
        false,
        "Some uploaded photos are invalid.",
        { details: validationResults.errors }
      );
    }

    // ✅ Mark main photo
    const photos = files.map((file, index) => ({
      url: `/uploads/photos/${file.filename}`,
      isMain: index === Number(mainPhotoIndex),
    }));

    // ✅ Update user in DB
    const updatedUser = await updateUser(userId, {
      "profile.photos": photos,
      "profile.quizScore": quizScore || "",
      profileStep: "completed",
    });

    if (!updatedUser) {
      return ResponseHandler.result(404, false, "User not found.", {});
    }

    return ResponseHandler.result(
      200,
      true,
      "Photos and quiz updated successfully.",
      {
        photos: updatedUser.profile.photos,
        quizScore: updatedUser.profile.quizScore,
      }
    );
  } catch (err) {
    console.error("Photo service error:", err);
    return ResponseHandler.result(
      500,
      false,
      "Error while updating photos and quiz.",
      {}
    );
  }
};
