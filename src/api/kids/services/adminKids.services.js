const {
  createKids,
  updateKidsById,
  checkKidsExistanceForUpdate,
  getKidsById,
  getKidsByName,
  deleteKidsByName,
} = require("@/api/kids/repository/kids.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateKids = async (name) => {
  try {
    const existingKids = await getKidsByName(name);

    if (existingKids && existingKids.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingKids && existingKids.status === "Delete") {
      await deleteKidsByName(name);
    }

    const newKids = await createKids(name);

    if (!newKids) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating kids",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Kids created successfully`, {});
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

exports.handleUpdateKids = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkKidsExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteKidsByName(payload?.name);
    }

    const updatedKids = await updateKidsById(id, payload);

    if (!updatedKids) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating kids",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Kids updated successfully`, {});
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

exports.handleGetKidsById = async (id) => {
  try {
    const kids = await getKidsById(id);

    if (!kids) {
      return ResponseHandler.result(404, false, "Kids not found", {});
    }

    return ResponseHandler.result(200, true, `Kids fetched successfully`, kids);
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