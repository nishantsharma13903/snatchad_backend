const {
  createPronoun,
  updatePronounById,
  checkPronounExistanceForUpdate,
  getPronounById,
  getPronounByName,
  deletePronounByName,
} = require("@/api/pronoun/repository/pronoun.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreatePronoun = async (name) => {
  try {
    const existingPronoun = await getPronounByName(name);

    if (existingPronoun && existingPronoun.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingPronoun && existingPronoun.status === "Delete") {
      await deletePronounByName(name);
    }

    const newPronoun = await createPronoun(name);

    if (!newPronoun) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating pronoun",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Pronoun created successfully`, {});
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

exports.handleUpdatePronoun = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkPronounExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deletePronounByName(payload?.name);
    }

    const updatedPronoun = await updatePronounById(id, payload);

    if (!updatedPronoun) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating pronoun",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Pronoun updated successfully`, {});
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

exports.handleGetPronounById = async (id) => {
  try {
    const pronoun = await getPronounById(id);

    if (!pronoun) {
      return ResponseHandler.result(404, false, "Pronoun not found", {});
    }

    return ResponseHandler.result(200, true, `Pronoun fetched successfully`, pronoun);
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