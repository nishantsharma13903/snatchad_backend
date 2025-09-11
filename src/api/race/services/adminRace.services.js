const {
  createRace,
  updateRaceById,
  checkRaceExistanceForUpdate,
  getRaceById,
  getRaceByName,
  deleteRaceByName,
} = require("@/api/race/repository/race.repo");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.handleCreateRace = async (name) => {
  try {
    const existingRace = await getRaceByName(name);

    if (existingRace && existingRace.status === "Active") {
      return ResponseHandler.result(400, false, "Already Exist", {});
    }

    if (existingRace && existingRace.status === "Delete") {
      await deleteRaceByName(name);
    }

    const newRace = await createRace(name);

    if (!newRace) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while creating race",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Race created successfully`, {});
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

exports.handleUpdateRace = async (id, payload) => {
  try {
    if (payload && payload?.name) {
      const isAlreadyExist = await checkRaceExistanceForUpdate(
        payload?.name,
        id
      );

      if (isAlreadyExist) {
        return ResponseHandler.result(400, false, "Already Exist", {});
      }

      await deleteRaceByName(payload?.name);
    }

    const updatedRace = await updateRaceById(id, payload);

    if (!updatedRace) {
      return ResponseHandler.result(
        500,
        false,
        "Something went wrong while updating race",
        {}
      );
    }

    return ResponseHandler.result(200, true, `Race updated successfully`, {});
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

exports.handleGetRaceById = async (id) => {
  try {
    const race = await getRaceById(id);

    if (!race) {
      return ResponseHandler.result(404, false, "Race not found", {});
    }

    return ResponseHandler.result(200, true, `Race fetched successfully`, race);
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