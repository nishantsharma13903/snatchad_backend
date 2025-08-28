const { handleGetAllGenders } = require("@/api/gender/services/gender.services");
const ResponseHandler = require("@/utils/response/responseHandler.utils");


exports.getAllGenders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const response = await handleGetAllGenders(page, limit, search);

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