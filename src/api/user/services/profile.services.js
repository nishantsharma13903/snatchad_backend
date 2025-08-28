const ResponseHandler = require("@utils/response/responseHandler.utils");
const logger = require("@utils/logger/logger.utils");
const { getUserById, updateUser } = require("../repository/user.repository");
const { validateImages } = require("@/helpers/images/images.helper");
const {
  removeCaseInsensitiveDuplicates,
} = require("@/helpers/other/removeDuplicates.helper");

// Fetch user details for a specific mode
exports.getUserDetail = async (userId, mode = "quiz") => {
  try {
    if (!userId) {
      return ResponseHandler.result(400, false, "User ID is required.", {});
    }

    const user = await getUserById(userId, "-password -__v -refreshToken");
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
          phone: user.phone,
          email: user.email,
          status: user.status,
          ...profileData,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

// Get profile step for a specific mode
exports.getProfileStep = async (userId, mode = "quiz") => {
  try {
    if (!userId) {
      return ResponseHandler.result(400, false, "User ID is required.", {});
    }

    const user = await getUserById(userId, "-password -__v -refreshToken");
    if (!user) {
      return ResponseHandler.result(404, false, "User not found.", {});
    }

    const profileStep = user.profiles?.[mode]?.profileStep || "dob";

    return ResponseHandler.result(
      200,
      true,
      "Profile step fetched successfully.",
      { profileStep }
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

exports.updateProfile = async (userId, mode = "quiz", updateData) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return ResponseHandler.result(404, false, "User not found.", {});
    }

    // ✅ Normalize updateData before merging
    const arrayFields = ["goals", "hobbies", "photos"];
    const objectFields = ["location"];

    arrayFields.forEach((field) => {
      if (updateData[field] && typeof updateData[field] === "string") {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          updateData[field] = updateData[field]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    });

    // 🛑 Ensure no duplicates (case-insensitive) for goals & hobbies
    if (
      ["goals", "hobbies"].includes(field) &&
      Array.isArray(updateData[field])
    ) {
      updateData[field] = removeCaseInsensitiveDuplicates(updateData[field]);
    }

    objectFields.forEach((field) => {
      if (updateData[field] && typeof updateData[field] === "string") {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          // leave as string if parse fails
        }
      }
    });

    let profile = user.profiles?.[mode] || {};

    if (updateData.location) {
      updateData.location = {
        type: "Point",
        coordinates: updateData.location,
      };
    }

    // ✅ Merge normalized fields
    profile = { ...profile, ...updateData };

    // ✅ Step progression logic
    if (
      profile.firstName &&
      profile.lastName &&
      profile.profileStep === "basicDetails"
    )
      profile.profileStep = "dob";

    if (profile.dob && profile.profileStep === "dob")
      profile.profileStep = "gender";

    if (profile.gender && profile.profileStep === "gender")
      profile.profileStep = "sexuality";

    if (profile.sexuality && profile.profileStep === "sexuality")
      profile.profileStep = "height";

    if (profile.height && profile.profileStep === "height") {
      profile.profileStep = "goals";
    }

    if (profile.goals?.length && profile.profileStep === "goals")
      profile.profileStep = "interest";

    if (profile.interest && profile.profileStep === "interest")
      profile.profileStep = "relationship";

    if (profile.relationship && profile.profileStep === "relationship")
      profile.profileStep = "hobbies";

    if (profile.hobbies?.length && profile.profileStep === "hobbies")
      profile.profileStep = "location";

    if (
      profile.location.coordinates[0] !== 0 &&
      profile.location.coordinates[1] !== 0 &&
      profile.profileStep === "location"
    )
      profile.profileStep = "photos";

    // Save back
    user.profiles = { ...user.profiles, [mode]: profile };
    await updateUser(userId, { profiles: user.profiles });

    return ResponseHandler.result(200, true, "Profile updated successfully.", {
      profileStep: profile.profileStep,
      profile,
    });
  } catch (error) {
    console.error(error);
    return ResponseHandler.result(
      500,
      false,
      error.message || "Internal Server Error",
      {}
    );
  }
};

// Update photos and quiz for a specific mode
exports.updatePhotosAndQuiz = async (
  userId,
  files,
  mainPhotoIndex,
  quizScore,
  mode = "quiz",
) => {
  try {
    if (!userId)
      return ResponseHandler.result(400, false, "User ID is required.", {});

    console.log( userId,
  mode = "quiz",
  files,
  mainPhotoIndex,
  quizScore)

    // if (!files || files.length !== 6)
    //   return ResponseHandler.result(
    //     400,
    //     false,
    //     "You must upload exactly 6 photos.",
    //     {}
    //   );

    const validationResults = await validateImages(files.map((f) => f.path));
    if (!validationResults.isValid) {
      return ResponseHandler.result(
        400,
        false,
        "Some uploaded photos are invalid.",
        { details: validationResults.errors }
      );
    }

    const photos = files.map((file, index) => ({
      url: file.path,
      isPrimary: index === Number.parseInt(mainPhotoIndex),
      order: index,
    }));

    const user = await getUserById(userId);
    if (!user) return ResponseHandler.result(404, false, "User not found.", {});

    const profile = user.profiles?.[mode] || {};
    profile.photos = photos.sort((a, b) => a.order - b.order);
    profile.quizScore = quizScore || 0;
    profile.profileStep = "completed";

    user.profiles = { ...user.profiles, [mode]: profile };
    await updateUser(userId, { profiles: user.profiles });

    return ResponseHandler.result(
      200,
      true,
      "Photos and quiz updated successfully.",
      {
        photos: profile.photos,
        quizScore: profile.quizScore,
      }
    );
  } catch (error) {
    logger.error("Photo service error:", error);
    return ResponseHandler.result(
      500,
      false,
      "Error while updating photos and quiz.",
      {}
    );
  }
};
