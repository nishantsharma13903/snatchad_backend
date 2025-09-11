const {
  createAlcohol,
  updateAlcoholById,
  checkAlcoholExistanceForUpdate,
  getAlcoholById,
  getAlcoholByName,
  deleteAlcoholByName,
} = require("@/api/alcohol/repository/alcohol.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateAlcohol = async (name) => {
  try {
    const existingAlcohol = await getAlcoholByName(name);

    if (existingAlcohol && existingAlcohol.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingAlcohol && existingAlcohol.status === "Delete") {
      await deleteAlcoholByName(name);
    }

    const newAlcohol = await createAlcohol(name);

    if (!newAlcohol) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating alcohol",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Alcohol created successfully`, {});
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

exports.handleUpdateAlcohol = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkAlcoholExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteAlcoholByName(payload?.name);
    }

    const updatedAlcohol = await updateAlcoholById(id, payload);

    if (!updatedAlcohol) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating alcohol",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Alcohol updated successfully`, {});
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

exports.handleGetAlcoholById = async (id) => {
  try {
    const alcohol = await getAlcoholById(id);

    if (!alcohol) {
      return ResponseHandler.result(404, false, "Alcohol not found", {});
    }

    return ResponseHandler.result(200, true, `Alcohol fetched successfully`, alcohol);
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