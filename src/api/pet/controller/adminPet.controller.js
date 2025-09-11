const {
  handleUpdatePet,
  handleGetPetById,
  handleCreatePet,
} = require("@/api/pet/services/adminPet.services");
const {
  createPetSchema,
  updatePetSchema,
} = require("@/api/pet/validator/adminPet.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewPet = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createPetSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreatePet(name);

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

exports.updatePet = async (req, res) => {
  try {
    const { petId } = req.params;

    if (!petId) {
      return ResponseHandler.error(res, "Pet Id is required", 400, {});
    }

    const { error } = await updatePetSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdatePet(petId, req.body);

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

exports.getPetById = async (req, res) => {
  try {
    const { petId } = req.params;

    if (!petId) {
      return ResponseHandler.error(res, "Pet Id is required", 400, {});
    }

    const response = await handleGetPetById(petId);

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
