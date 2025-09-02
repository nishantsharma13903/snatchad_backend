const {
  createDrinking,
  updateDrinkingById,
  checkDrinkingExistanceForUpdate,
  getDrinkingById,
  getDrinkingByName,
  deleteDrinkingByName,
} = require("@/api/drinking/repository/drinking.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateDrinking = async (name) => {
  try {
    const existingDrinking = await getDrinkingByName(name);

    if (existingDrinking && existingDrinking.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingDrinking && existingDrinking.status === "Delete") {
      await deleteDrinkingByName(name);
    }

    const newDrinking = await createDrinking(name);

    if (!newDrinking) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating drinking",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Drinking created successfully`, {});
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

exports.handleUpdateDrinking = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkDrinkingExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteDrinkingByName(payload?.name);
    }

    const updatedDrinking = await updateDrinkingById(id, payload);

    if (!updatedDrinking) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating drinking",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Drinking updated successfully`, {});
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

exports.handleGetDrinkingById = async (id) => {
  try {
    const drinking = await getDrinkingById(id);

    if (!drinking) {
      return ResponseHandler.result(404, false, "Drinking not found", {});
    }

    return ResponseHandler.result(200, true, `Drinking fetched successfully`, drinking);
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