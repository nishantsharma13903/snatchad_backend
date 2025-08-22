// Later you can integrate with AI/ML or 3rd party service for deep fake/AI image detection
exports.validateImageFile = async (filePath) => {
  try {
    // Example basic validation (can extend with AI detection APIs)
    if (!filePath.endsWith(".jpg") && !filePath.endsWith(".png")) {
      return false;
    }

    // TODO: Add AI fake detection API integration
    return true;
  } catch (err) {
    console.error("Image file validation error:", err);
    return false;
  }
};
