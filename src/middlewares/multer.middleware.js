// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/tmp/my-uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 2 * 1024 * 1024 },
// });

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folder exists
const uploadPath = path.join(__dirname, "..", "uploads", "photos");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG images are allowed"), false);
  }
  cb(null, true);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Middleware to enforce exactly 6 files
const validateSixFiles = (req, res, next) => {
  if (!req.files || req.files.length !== 6) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Exactly 6 photos must be uploaded.",
      result: {},
    });
  }
  next();
};

const validateThreeFiles = (req, res, next) => {
  if (!req.files || req.files.length !== 3) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Exactly 3 photos must be uploaded for versus mode.",
      result: {},
    });
  }
  next();
};

module.exports = {upload,validateSixFiles,validateThreeFiles};

