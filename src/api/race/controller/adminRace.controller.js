const {
  handleUpdateRace,
  handleGetRaceById,
  handleCreateRace,
} = require("@/api/race/services/adminRace.services");
const {
  createRaceSchema,
  updateRaceSchema,
} = require("@/api/race/validator/adminRace.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewRace = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createRaceSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateRace(name);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};

exports.updateRace = async (req, res) => {
  try {
    const { raceId } = req.params;

    if (!raceId) {
      return ResponseHandler.error(res, "Race Id is required", 400, {});
    }

    const { error } = await updateRaceSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateRace(raceId, req.body);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};

exports.getRaceById = async (req, res) => {
  try {
    const { raceId } = req.params;

    if (!raceId) {
      return ResponseHandler.error(res, "Race Id is required", 400, {});
    }

    const response = await handleGetRaceById(raceId);

    if (response.success) {
      return ResponseHandler.success(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    } else {
      return ResponseHandler.error(
        res,
        response.message,
        response.statusCode,
        response.result
      );
    }
  } catch (error) {
    return ResponseHandler.error(
      res,
      error.message || "Internal server Error",
      500,
      {}
    );
  }
};
