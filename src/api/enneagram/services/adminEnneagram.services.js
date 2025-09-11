const {
  createEnneagram,
  updateEnneagramById,
  checkEnneagramExistanceForUpdate,
  getEnneagramById,
  getEnneagramByName,
  deleteEnneagramByName,
} = require("@/api/enneagram/repository/enneagram.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateEnneagram = async (name) => {
  try {
    const existingEnneagram = await getEnneagramByName(name);

    if (existingEnneagram && existingEnneagram.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingEnneagram && existingEnneagram.status === "Delete") {
      await deleteEnneagramByName(name);
    }

    const newEnneagram = await createEnneagram(name);

    if (!newEnneagram) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating enneagram",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Enneagram created successfully`, {});
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

exports.handleUpdateEnneagram = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkEnneagramExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteEnneagramByName(payload?.name);
    }

    const updatedEnneagram = await updateEnneagramById(id, payload);

    if (!updatedEnneagram) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating enneagram",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Enneagram updated successfully`, {});
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

exports.handleGetEnneagramById = async (id) => {
  try {
    const enneagram = await getEnneagramById(id);

    if (!enneagram) {
      return ResponseHandler.result(404, false, "Enneagram not found", {});
    }

    return ResponseHandler.result(200, true, `Enneagram fetched successfully`, enneagram);
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