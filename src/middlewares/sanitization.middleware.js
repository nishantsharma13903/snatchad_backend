// middlewares/sanitizeRequest.js
function sanitize(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitize(obj[key]); // recursively sanitize nested objects
    }

    if (typeof key === 'string' && (key.includes('$') || key.includes('.'))) {
      delete obj[key];
    }
  }
}

module.exports = (req, res, next) => {
  if (req.body) sanitize(req.body);
  if (req.query) sanitize({ ...req.query }); // shallow copy to avoid mutating directly
  if (req.params) sanitize(req.params);
  next();
};
