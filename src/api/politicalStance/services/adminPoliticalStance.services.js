const {
  createPoliticalStance,
  updatePoliticalStanceById,
  checkPoliticalStanceExistanceForUpdate,
  getPoliticalStanceById,
  getPoliticalStanceByName,
  deletePoliticalStanceByName,
} = require("@/api/politicalStance/repository/politicalStance.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreatePoliticalStance = async (name) => {
  try {
    const existingPoliticalStance = await getPoliticalStanceByName(name);

    if (existingPoliticalStance && existingPoliticalStance.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingPoliticalStance && existingPoliticalStance.status === "Delete") {
      await deletePoliticalStanceByName(name);
    }

    const newPoliticalStance = await createPoliticalStance(name);

    if (!newPoliticalStance) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating politicalStance",
        {}
      );
    }

    return ResponseHandler.result(200, true, `PoliticalStance created successfully`, {});
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

exports.handleUpdatePoliticalStance = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkPoliticalStanceExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deletePoliticalStanceByName(payload?.name);
    }

    const updatedPoliticalStance = await updatePoliticalStanceById(id, payload);

    if (!updatedPoliticalStance) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating politicalStance",
        {}
      );
    }

    return ResponseHandler.result(200, true, `PoliticalStance updated successfully`, {});
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

exports.handleGetPoliticalStanceById = async (id) => {
  try {
    const politicalStance = await getPoliticalStanceById(id);

    if (!politicalStance) {
      return ResponseHandler.result(404, false, "PoliticalStance not found", {});
    }

    return ResponseHandler.result(200, true, `PoliticalStance fetched successfully`, politicalStance);
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