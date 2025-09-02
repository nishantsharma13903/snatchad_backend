const {
  createReligion,
  updateReligionById,
  checkReligionExistanceForUpdate,
  getReligionById,
  getReligionByName,
  deleteReligionByName,
} = require("@/api/religion/repository/religion.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateReligion = async (name) => {
  try {
    const existingReligion = await getReligionByName(name);

    if (existingReligion && existingReligion.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingReligion && existingReligion.status === "Delete") {
      await deleteReligionByName(name);
    }

    const newReligion = await createReligion(name);

    if (!newReligion) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating religion",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Religion created successfully`, {});
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

exports.handleUpdateReligion = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkReligionExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteReligionByName(payload?.name);
    }

    const updatedReligion = await updateReligionById(id, payload);

    if (!updatedReligion) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating religion",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Religion updated successfully`, {});
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

exports.handleGetReligionById = async (id) => {
  try {
    const religion = await getReligionById(id);

    if (!religion) {
      return ResponseHandler.result(404, false, "Religion not found", {});
    }

    return ResponseHandler.result(200, true, `Religion fetched successfully`, religion);
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