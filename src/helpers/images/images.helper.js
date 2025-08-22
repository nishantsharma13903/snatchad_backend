const { validateImageFile } = require("@/utils/validations/imageValidator.utils");

exports.validateImages = async (imagePaths) => {
  try {
    let errors = [];

    for (const path of imagePaths) {
      const valid = await validateImageFile(path);
      if (!valid) {
        errors.push(`Invalid image detected: ${path}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  } catch (err) {
    console.error("Image validation error:", err);
    return {
      isValid: false,
      errors: ["Internal error in image validation"],
    };
  }
};