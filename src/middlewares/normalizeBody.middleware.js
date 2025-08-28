// middlewares/normalizeBody.middleware.js
module.exports = (req, res, next) => {
  if (!req.body || typeof req.body !== "object") {
    return next(); // nothing to normalize
  }

  // fields that may come as arrays
  const arrayFields = ["goals", "interests", "hobbies", "photos"];

  // fields that may come as objects
  const objectFields = ["location"];

  // Normalize arrays
  arrayFields.forEach((field) => {
    if (req.body[field] && typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]); // "[...]" -> [...]
      } catch (e) {
        // fallback for "a,b,c"
        req.body[field] = req.body[field].split(",").map((s) => s.trim());
      }
    }
  });

  // Normalize objects
  objectFields.forEach((field) => {
    if (req.body[field] && typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]); // "{...}" -> {...}
      } catch (e) {
        // leave as-is if parsing fails
      }
    }
  });

  next();
};
