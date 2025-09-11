const {
  createZodiacSign,
  updateZodiacSignById,
  checkZodiacSignExistanceForUpdate,
  getZodiacSignById,
  getZodiacSignByName,
  deleteZodiacSignByName,
} = require("@/api/zodiacSign/repository/zoadiacSign.repo");
const logger = require("@/utils/logger/logger.utils");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateZodiacSign = async (name) => {
  try {
    const existingZodiacSign = await getZodiacSignByName(name);

    if (existingZodiacSign && existingZodiacSign.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingZodiacSign && existingZodiacSign.status === "Delete") {
      await deleteZodiacSignByName(name);
    }

    const newZodiacSign = await createZodiacSign(name);

    if (!newZodiacSign) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating zodiacSign",
        {}
      );
    }

    return ResponseHandler.result(200, true, `ZodiacSign created successfully`, {});
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

exports.handleUpdateZodiacSign = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkZodiacSignExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteZodiacSignByName(payload?.name);
    }

    const updatedZodiacSign = await updateZodiacSignById(id, payload);

    if (!updatedZodiacSign) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating zodiacSign",
        {}
      );
    }

    return ResponseHandler.result(200, true, `ZodiacSign updated successfully`, {});
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

exports.handleGetZodiacSignById = async (id) => {
  try {
    const zodiacSign = await getZodiacSignById(id);

    if (!zodiacSign) {
      return ResponseHandler.result(404, false, "ZodiacSign not found", {});
    }

    return ResponseHandler.result(200, true, `ZodiacSign fetched successfully`, zodiacSign);
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