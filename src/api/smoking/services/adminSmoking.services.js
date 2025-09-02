const {
  createSmoking,
  updateSmokingById,
  checkSmokingExistanceForUpdate,
  getSmokingById,
  getSmokingByName,
  deleteSmokingByName,
} = require("@/api/smoking/repository/smoking.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateSmoking = async (name) => {
  try {
    const existingSmoking = await getSmokingByName(name);

    if (existingSmoking && existingSmoking.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingSmoking && existingSmoking.status === "Delete") {
      await deleteSmokingByName(name);
    }

    const newSmoking = await createSmoking(name);

    if (!newSmoking) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating smoking",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Smoking created successfully`, {});
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

exports.handleUpdateSmoking = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkSmokingExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteSmokingByName(payload?.name);
    }

    const updatedSmoking = await updateSmokingById(id, payload);

    if (!updatedSmoking) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating smoking",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Smoking updated successfully`, {});
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

exports.handleGetSmokingById = async (id) => {
  try {
    const smoking = await getSmokingById(id);

    if (!smoking) {
      return ResponseHandler.result(404, false, "Smoking not found", {});
    }

    return ResponseHandler.result(200, true, `Smoking fetched successfully`, smoking);
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