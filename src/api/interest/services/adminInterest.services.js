const {
  createInterest,
  updateInterestById,
  checkInterestExistanceForUpdate,
  getInterestById,
  getInterestByName,
  deleteInterestByName,
} = require("@/api/interest/repository/interest.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateInterest = async (name) => {
  try {
    const existingInterest = await getInterestByName(name);

    if (existingInterest && existingInterest.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingInterest && existingInterest.status === "Delete") {
      await deleteInterestByName(name);
    }

    const newInterest = await createInterest(name);

    if (!newInterest) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating interest",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Interest created successfully`, {});
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

exports.handleUpdateInterest = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkInterestExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteInterestByName(payload?.name);
    }

    const updatedInterest = await updateInterestById(id, payload);

    if (!updatedInterest) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating interest",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Interest updated successfully`, {});
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

exports.handleGetInterestById = async (id) => {
  try {
    const interest = await getInterestById(id);

    if (!interest) {
      return ResponseHandler.result(404, false, "Interest not found", {});
    }

    return ResponseHandler.result(200, true, `Interest fetched successfully`, interest);
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