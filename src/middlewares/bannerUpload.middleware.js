const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("@/config/cloudinary/cloudinary.config");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "banners", // Cloudinary folder
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }]
  },
});

const upload = multer({ storage });

module.exports = upload;