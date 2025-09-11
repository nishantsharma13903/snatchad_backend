const {
  handleUpdateZodiacSign,
  handleGetZodiacSignById,
  handleCreateZodiacSign,
} = require("@/api/zodiacSign/services/adminZoadiacSign.services");
const {
  createZodiacSignSchema,
  updateZodiacSignSchema,
} = require("@/api/zodiacSign/validator/adminZoadiacSign.validator");
const ResponseHandler = require("@/utils/response/responseHandler.utils");

exports.createNewZodiacSign = async (req, res) => {
  try {
    const { name } = req.body;

    const { error } = await createZodiacSignSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleCreateZodiacSign(name);

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

exports.updateZodiacSign = async (req, res) => {
  try {
    const { zodiacSignId } = req.params;

    if (!zodiacSignId) {
      return ResponseHandler.error(res, "ZodiacSign Id is required", 400, {});
    }

    const { error } = await updateZodiacSignSchema.validateAsync(req.body);

    if (error) {
      return ResponseHandler.error(
        res,
        error.details[0].message, // Joi's error message
        400,
        {}
      );
    }

    const response = await handleUpdateZodiacSign(zodiacSignId, req.body);

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

exports.getZodiacSignById = async (req, res) => {
  try {
    const { zodiacSignId } = req.params;

    if (!zodiacSignId) {
      return ResponseHandler.error(res, "ZodiacSign Id is required", 400, {});
    }

    const response = await handleGetZodiacSignById(zodiacSignId);

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
