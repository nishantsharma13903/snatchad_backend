const {
  createDateIdea,
  updateDateIdeaById,
  checkDateIdeaExistanceForUpdate,
  getDateIdeaById,
  getDateIdeaByName,
  deleteDateIdeaByName,
} = require("@/api/dateIdea/repository/dateIdea.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateDateIdea = async (name) => {
  try {
    const existingDateIdea = await getDateIdeaByName(name);

    if (existingDateIdea && existingDateIdea.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingDateIdea && existingDateIdea.status === "Delete") {
      await deleteDateIdeaByName(name);
    }

    const newDateIdea = await createDateIdea(name);

    if (!newDateIdea) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating dateIdea",
        {}
      );
    }

    return ResponseHandler.result(200, true, `DateIdea created successfully`, {});
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

exports.handleUpdateDateIdea = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkDateIdeaExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteDateIdeaByName(payload?.name);
    }

    const updatedDateIdea = await updateDateIdeaById(id, payload);

    if (!updatedDateIdea) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating dateIdea",
        {}
      );
    }

    return ResponseHandler.result(200, true, `DateIdea updated successfully`, {});
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

exports.handleGetDateIdeaById = async (id) => {
  try {
    const dateIdea = await getDateIdeaById(id);

    if (!dateIdea) {
      return ResponseHandler.result(404, false, "DateIdea not found", {});
    }

    return ResponseHandler.result(200, true, `DateIdea fetched successfully`, dateIdea);
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