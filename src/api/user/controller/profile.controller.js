const ResponseHandler = require("@/utils/response/responseHandler.utils");
const userService = require("../services/profile.services");
const {
  getPhotoQuizSchemaByMode,
} = require("@/api/user/validator/profile.validator");

// Get user profile (mode-specific)
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req?.token?._id;
    const mode = req?.query?.mode || "quiz"; // default to quiz mode

    if (!["quiz", "snatched", "versus"].includes(mode)) {
      return ResponseHandler.error(
        res,
        "Invalid Mode (Possible values are 'quiz','snatched', 'versus')",
        400,
        {}
      );
    }

    if (!userId) {
      return ResponseHandler.error(res, "User ID is required.", 400, {});
    }

    const response = await userService.getUserDetail(userId, mode);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server error",
      500,
      {}
    );
  }
};

// Get profile step (mode-specific)
exports.getProfileStep = async (req, res) => {
  try {
    const userId = req.token._id;
    const mode = req.query.mode || "quiz";

    if (!["quiz", "snatched", "versus"].includes(mode)) {
      return ResponseHandler.error(
        res,
        "Invalid Mode (Possible values are 'quiz','snatched', 'versus')",
        400,
        {}
      );
    }

    const response = await userService.getProfileStep(userId, mode);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server error",
      500,
      {}
    );
  }
};

// Update profile fields (mode-specific)
exports.updateProfile = async (req, res) => {
  try {

    const userId = req.token._id;
    const mode = req.query.mode || "quiz";
    if (!["quiz", "snatched", "versus"].includes(mode)) {
      return ResponseHandler.error(
        res,
        "Invalid Mode (Possible values are 'quiz','snatched', 'versus')",
        400,
        {}
      );
    }
    const updateData = req.body;

    const response = await userService.updateProfile(userId, mode, updateData);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server error",
      500,
      {}
    );
  }
};

// Update photos + quiz
exports.updatePhotosAndQuiz = async (req, res) => {
  try {
    const mode = req.query.mode || "quiz";
    if (!["quiz", "snatched", "versus"].includes(mode)) {
      return ResponseHandler.error(
        res,
        "Invalid Mode (Possible values are 'quiz','snatched', 'versus')",
        400,
        {}
      );
    }

    console.log("req.files",req.files,req.file)

    // Validate request body based on mode
    const schema = getPhotoQuizSchemaByMode(mode);
    await schema.validateAsync(req.body);

    const { mainPhotoIndex=0, quizScore } = req.body;
    const userId = req.token._id;

    const response = await userService.updatePhotosAndQuiz(
      userId,
      req.files,
      mainPhotoIndex,
      quizScore,
      mode
    );

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
    return ResponseHandler.error(
      res,
      response.message,
      response.statusCode,
      response.result
    );
  } catch (err) {
    return ResponseHandler.error(
      res,
      err.message || "Internal Server Error",
      500,
      {}
    );
  }
};
