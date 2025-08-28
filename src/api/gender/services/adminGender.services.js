const {
  checkGenderExistance,
  createGender,
  updateGenderById,
  checkGenderExistanceForUpdate,
  getGenderById,
  getAllGenders,
  getGenderByName,
  deleteGenderByName,
} = require("@/api/gender/repository/gender.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateGender = async (name) => {
  try {
    const existingGender = await getGenderByName(name);

    if (existingGender && existingGender.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingGender && existingGender.status === "Delete") {
      await deleteGenderByName(name);
    }

    const newGender = await createGender(name);

    if (!newGender) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating gender",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Gender created successfully`, {});
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

exports.handleUpdateGender = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkGenderExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteGenderByName(payload?.name);
    }

    const updatedGender = await updateGenderById(id, payload);

    if (!updatedGender) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating gender",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Gender updated successfully`, {});
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

exports.handleGetGenderById = async (id) => {
  try {
    const gender = await getGenderById(id);

    if (!gender) {
      return ResponseHandler.result(404, false, "Gender not found", {});
    }

    return ResponseHandler.result(200, true, `Gender fetched successfully`, gender);
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