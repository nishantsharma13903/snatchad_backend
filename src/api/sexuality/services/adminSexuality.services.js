const {
  createSexuality,
  updateSexualityById,
  checkSexualityExistanceForUpdate,
  getSexualityById,
  getSexualityByName,
  deleteSexualityByName,
} = require("@/api/sexuality/repository/sexuality.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateSexuality = async (name) => {
  try {
    const existingSexuality = await getSexualityByName(name);

    if (existingSexuality && existingSexuality.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingSexuality && existingSexuality.status === "Delete") {
      await deleteSexualityByName(name);
    }

    const newSexuality = await createSexuality(name);

    if (!newSexuality) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating sexuality",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Sexuality created successfully`, {});
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

exports.handleUpdateSexuality = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkSexualityExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteSexualityByName(payload?.name);
    }

    const updatedSexuality = await updateSexualityById(id, payload);

    if (!updatedSexuality) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating sexuality",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Sexuality updated successfully`, {});
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

exports.handleGetSexualityById = async (id) => {
  try {
    const sexuality = await getSexualityById(id);

    if (!sexuality) {
      return ResponseHandler.result(404, false, "Sexuality not found", {});
    }

    return ResponseHandler.result(200, true, `Sexuality fetched successfully`, sexuality);
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