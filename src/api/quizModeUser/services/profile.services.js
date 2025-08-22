const ResponseHandler = require("@utils/response/responseHandler.utils");
const logger = require("@utils/logger/logger.utils");
const { getUserById, updateUser } = require("../repository/user.repository");
const { validateImages } = require("@/helpers/images/images.helper");

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

// Update profile fields for a specific mode
// exports.updateProfile = async (userId, mode = "quiz", updateData) => {
//   try {
//     const user = await getUserById(userId);
//     if (!user) {
//       return ResponseHandler.result(404, false, "User not found.", {});
//     }

//     const profile = user.profiles?.[mode] || {};

//     // Merge updated fields
//     Object.assign(profile, updateData);

//     // Step progression logic
//     if (
//       updateData.firstName &&
//       updateData.lastName &&
//       profile.profileStep === "basicDetails"
//     )
//       profile.profileStep = "dob";
//     if (updateData.dob && profile.profileStep === "dob")
//       profile.profileStep = "identity";
//     if (
//       updateData.identity &&
//       updateData.sexuality &&
//       profile.profileStep === "identity"
//     )
//       profile.profileStep = "height";
//     if (updateData.height && profile.profileStep === "height")
//       profile.profileStep = "goals";
//     if (updateData.goals && profile.profileStep === "goals")
//       profile.profileStep = "interests";
//     if (
//       updateData.interests &&
//       updateData.lookingFor &&
//       profile.profileStep === "interests"
//     )
//       profile.profileStep = "hobbies";
//     if (updateData.hobbies && profile.profileStep === "hobbies")
//       profile.profileStep = "location";
//     if (updateData.location && profile.profileStep === "location")
//       profile.profileStep = "photos";
//     if (
//       updateData.photos &&
//       updateData.photos.length >= 6 &&
//       profile.profileStep === "photos"
//     )
//       profile.profileStep = "quiz";
//     if (updateData.quizScore && profile.profileStep === "quiz")
//       profile.profileStep = "completed";

//     // Save under the correct mode
//     user.profiles = { ...user.profiles, [mode]: profile };
//     await updateUser(userId, { profiles: user.profiles });

//     return ResponseHandler.result(200, true, "Profile updated successfully.", {
//       profileStep: profile.profileStep,
//     });
//   } catch (error) {
//     console.error(error);
//     return ResponseHandler.result(
//       500,
//       false,
//       error.message || "Internal Server Error",
//       {}
//     );
//   }
// };

exports.updateProfile = async (userId, mode = "quiz", updateData) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return ResponseHandler.result(404, false, "User not found.", {});
    }

    let profile = user.profiles?.[mode] || {};

    // Merge fields
    profile = { ...profile, ...updateData };

    // Step progression
    if (profile.firstName && profile.lastName && profile.profileStep === "basicDetails")
      profile.profileStep = "dob";

    if (profile.dob && profile.profileStep === "dob")
      profile.profileStep = "identity";

    if (profile.identity && profile.sexuality && profile.profileStep === "identity")
      profile.profileStep = "height";

    if (profile.height && profile.profileStep === "height")
      profile.profileStep = "goals";

    if (profile.goals?.length && profile.profileStep === "goals")
      profile.profileStep = "interests";

    if (profile.interests?.length && profile.lookingFor?.length && profile.profileStep === "interests")
      profile.profileStep = "hobbies";

    if (profile.hobbies?.length && profile.profileStep === "hobbies")
      profile.profileStep = "location";

    if (profile.location && profile.profileStep === "location")
      profile.profileStep = "photos";

    if (profile.photos?.length >= 6 && profile.profileStep === "photos")
      profile.profileStep = "quiz";

    if (typeof profile.quizScore === "number" && profile.profileStep === "quiz")
      profile.profileStep = "completed";

    // Save
    user.profiles = { ...user.profiles, [mode]: profile };
    await updateUser(userId, { profiles: user.profiles });

    return ResponseHandler.result(200, true, "Profile updated successfully.", {
      profileStep: profile.profileStep,
      profile
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

exports.updateProfile = async (userId, mode = "quiz", updateData) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return ResponseHandler.result(404, false, "User not found.", {});
    }

    // ✅ Normalize updateData before merging
    const arrayFields = ["goals", "lookingFor", "hobbies", "photos"];
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

    // ✅ Merge normalized fields
    profile = { ...profile, ...updateData };

    // ✅ Step progression logic
    if (profile.firstName && profile.lastName && profile.profileStep === "basicDetails")
      profile.profileStep = "dob";

    if (profile.dob && profile.profileStep === "dob")
      profile.profileStep = "identity";

    if (profile.identity && profile.sexuality && profile.profileStep === "identity")
      profile.profileStep = "height";

    if (profile.height && profile.profileStep === "height")
      profile.profileStep = "goals";

    if (profile.goals?.length && profile.profileStep === "goals")
      profile.profileStep = "interests";

    if (profile.interests?.length && profile.lookingFor?.length && profile.profileStep === "interests")
      profile.profileStep = "hobbies";

    if (profile.hobbies?.length && profile.profileStep === "hobbies")
      profile.profileStep = "location";

    if (profile.location && profile.profileStep === "location")
      profile.profileStep = "photos";

    if (profile.photos?.length >= 6 && profile.profileStep === "photos")
      profile.profileStep = "quiz";

    if (typeof profile.quizScore === "number" && profile.profileStep === "quiz")
      profile.profileStep = "completed";

    // Save back
    user.profiles = { ...user.profiles, [mode]: profile };
    await updateUser(userId, { profiles: user.profiles });

    return ResponseHandler.result(200, true, "Profile updated successfully.", {
      profileStep: profile.profileStep,
      profile
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
  mode = "quiz",
  files,
  mainPhotoIndex,
  quizScore
) => {
  try {
    if (!userId)
      return ResponseHandler.result(400, false, "User ID is required.", {});
    if (!files || files.length !== 6)
      return ResponseHandler.result(
        400,
        false,
        "You must upload exactly 6 photos.",
        {}
      );

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
      url: `/uploads/photos/${file.filename}`,
      isMain: index === Number(mainPhotoIndex),
    }));

    const user = await getUserById(userId);
    if (!user) return ResponseHandler.result(404, false, "User not found.", {});

    const profile = user.profiles?.[mode] || {};
    profile.photos = photos;
    profile.quizScore = quizScore || null;
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
    console.error("Photo service error:", error);
    return ResponseHandler.result(
      500,
      false,
      "Error while updating photos and quiz.",
      {}
    );
  }
};
