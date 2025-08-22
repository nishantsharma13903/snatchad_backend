const ResponseHandler = require("@/utils/response/responseHandler.utils");

const createValidator = (property) => {
  return (schema) => {
    return async (req, res, next) => {
      try {
        let data = req[property];

        // Special handling for files
        if (property === "file" && req.file) {
          data = req.file;
        } else if (property === "files" && req.files) {
          data = req.files;
        }

        await schema.validateAsync(data, { abortEarly: true });
        next();
      } catch (error) {
        return ResponseHandler.error(
          res,
          error.details?.[0]?.message || `Invalid request ${property}`,
          400,
          {}
        );
      }
    };
  };
};

const validateBody = createValidator("body");
const validateQuery = createValidator("query");
const validateParams = createValidator("params");
const validateFile = createValidator("file");   // for single file
const validateFiles = createValidator("files"); // for multiple files

module.exports = {
  validateBody,
  validateQuery,
  validateParams,
  validateFile,
  validateFiles,
};