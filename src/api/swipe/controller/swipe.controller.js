// src/controllers/swipe.controller.js
const ResponseHandler = require("@/utils/response/responseHandler.utils");
const { handleSwipe } = require("../services/swipe.services");

exports.swipeAction = async (req, res) => {
  try {
    const { targetId, action } = req.body;
    const userId = req.token._id; // assuming auth middleware

    if (!["like", "dislike"].includes(action)) {
        return ResponseHandler.error(res, "Invalid action", 400, {})
    }

    const swipe = await handleSwipe(userId, targetId, action);

    return ResponseHandler.success(res, "Swipe Registered", 200, swipe);
  } catch (error) {
    console.error("Swipe API error:", error);
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
}

exports.swipeAction = async (req, res) => {
  try {
    const { targetId, action } = req.body;
    const userId = req.token._id; // from auth middleware

    if (!["like", "dislike"].includes(action)) {
      return ResponseHandler.error(res, "Invalid action", 400, {});
    }

    // enqueue only, no Mongo write here
    await handleSwipe(userId, targetId, action);

    return ResponseHandler.success(res, "Swipe received", 200, {
      enqueued: true,
    });
  } catch (error) {
    console.error("Swipe API error:", error);
    return ResponseHandler.error(
      res,
      error.message || "Internal Server Error",
      500,
      {}
    );
  }
};