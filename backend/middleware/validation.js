const { validationResult } = require("express-validator");

/**
 * After specifying a list of validation rules for some route taking in
 * input, use this middleware to trigger all of the validation/sanitization
 * rules. The request will be rejected with a 400 with it does not meet
 * the validation criteria.
 */
const validateRequest = (req, res, next) => {
  const vres = validationResult(req);
  if (vres.isEmpty()) {
    return next();
  } else {
    const bad_fields = new Set();
    for (const error of vres.errors) {
      bad_fields.add(error.param);
    }
    return res
      .status(400)
      .json({ message: `Invalid or missing: ${[...bad_fields].join(", ")}` });
  }
};

module.exports = {
  validateRequest,
};
