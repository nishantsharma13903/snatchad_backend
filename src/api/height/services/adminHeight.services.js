const {
  createHeight,
  updateHeightById,
  checkHeightExistanceForUpdate,
  getHeightById,
  deleteHeightByName,
  getHeightByNumber,
  deleteHeightByNumber,
} = require("@/api/height/repository/height.repo");
const { cmToFeetInches } = require("@/helpers/other/height.helper");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateHeight = async (heightInCm) => {
  try {

    heightInCm = Number.parseInt(heightInCm);

    const existingHeight = await getHeightByNumber(heightInCm);

    if (existingHeight && existingHeight.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingHeight && existingHeight.status === "Delete") {
      await deleteHeightByNumber(heightInCm);
    }

    const heightInFoot = cmToFeetInches(heightInCm);

    console.log(heightInFoot)

    const newHeight = await createHeight(heightInCm,heightInFoot);

    if (!newHeight) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating height",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Height created successfully`, {});
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

exports.handleUpdateHeight = async (id, payload) => {
  try {

    if (payload && payload?.heightInCm) {
      payload.heightInCm = Number.parseInt(payload.heightInCm)
      const isAlreadyExist = await checkHeightExistanceForUpdate(
        payload?.heightInCm,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteHeightByNumber(payload?.heightInCm);

      payload.heightInFoot = cmToFeetInches(payload.heightInCm);
    }

    const updatedHeight = await updateHeightById(id, payload);

    if (!updatedHeight) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating height",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Height updated successfully`, {});
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

exports.handleGetHeightById = async (id) => {
  try {
    const height = await getHeightById(id);

    if (!height) {
      return ResponseHandler.result(404, false, "Height not found", {});
    }

    return ResponseHandler.result(200, true, `Height fetched successfully`, height);
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