const fs = require("fs");
const path = require("path");

/**
 * Delete a file safely if it exists
 * @param {string} filePath - The relative or absolute path of the file
 */
const deleteFile = (filePath) => {
  if (!filePath) return;

  // Ensure we resolve the absolute path
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(__dirname, "..", "..","..", filePath);

  console.log("Trying to delete:", absolutePath);

  try {
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log("File removed:", absolutePath);
    }
  } catch (err) {
    console.error("Error deleting file:", err.message);
  }
};

module.exports = { deleteFile };
