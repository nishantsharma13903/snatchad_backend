const {
  createTHC,
  updateTHCById,
  checkTHCExistanceForUpdate,
  getTHCById,
  getTHCByName,
  deleteTHCByName,
} = require("@/api/thc/repository/thc.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateTHC = async (name) => {
  try {
    const existingTHC = await getTHCByName(name);

    if (existingTHC && existingTHC.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingTHC && existingTHC.status === "Delete") {
      await deleteTHCByName(name);
    }

    const newTHC = await createTHC(name);

    if (!newTHC) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating thc",
        {}
      );
    }

    return ResponseHandler.result(200, true, `THC created successfully`, {});
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

exports.handleUpdateTHC = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkTHCExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteTHCByName(payload?.name);
    }

    const updatedTHC = await updateTHCById(id, payload);

    if (!updatedTHC) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating thc",
        {}
      );
    }

    return ResponseHandler.result(200, true, `THC updated successfully`, {});
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

exports.handleGetTHCById = async (id) => {
  try {
    const thc = await getTHCById(id);

    if (!thc) {
      return ResponseHandler.result(404, false, "THC not found", {});
    }

    return ResponseHandler.result(200, true, `THC fetched successfully`, thc);
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