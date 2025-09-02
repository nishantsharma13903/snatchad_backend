const {
  createLanguages,
  updateLanguagesById,
  checkLanguagesExistanceForUpdate,
  getLanguagesById,
  getLanguagesByName,
  deleteLanguagesByName,
} = require("@/api/languages/repository/languages.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateLanguages = async (name) => {
  try {
    const existingLanguages = await getLanguagesByName(name);

    if (existingLanguages && existingLanguages.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingLanguages && existingLanguages.status === "Delete") {
      await deleteLanguagesByName(name);
    }

    const newLanguages = await createLanguages(name);

    if (!newLanguages) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating languages",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Languages created successfully`, {});
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

exports.handleUpdateLanguages = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkLanguagesExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteLanguagesByName(payload?.name);
    }

    const updatedLanguages = await updateLanguagesById(id, payload);

    if (!updatedLanguages) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating languages",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Languages updated successfully`, {});
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

exports.handleGetLanguagesById = async (id) => {
  try {
    const languages = await getLanguagesById(id);

    if (!languages) {
      return ResponseHandler.result(404, false, "Languages not found", {});
    }

    return ResponseHandler.result(200, true, `Languages fetched successfully`, languages);
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