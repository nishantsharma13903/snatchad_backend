const {
  handleUpdateDrug,
  handleGetDrugById,
  handleCreateDrug,
} = require("@/api/drug/services/adminDrug.services");
const {
  createDrugSchema,
  updateDrugSchema,
} = require("@/api/drug/validator/adminDrug.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewDrug = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createDrugSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateDrug(name);

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

exports.updateDrug = async (req, res) => {
  try {
    const { drugId } = req.params;

    if (!drugId) {
      return ResponseHandler.error(res, "Drug Id is required", 400, {});
    }

    const { error } = await updateDrugSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateDrug(drugId, req.body);

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

exports.getDrugById = async (req, res) => {
  try {
    const { drugId } = req.params;

    if (!drugId) {
      return ResponseHandler.error(res, "Drug Id is required", 400, {});
    }

    const response = await handleGetDrugById(drugId);

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
