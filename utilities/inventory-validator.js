const { body, validationResult } = require("express-validator");

const invValidation = {};

// Add Classification Validation
invValidation.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .isAlpha()
      .withMessage("Classification name must contain only letters."),
  ];
};

// Add Inventory Validation
invValidation.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),
    body("inv_year")
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
      .withMessage("Year must be a valid year."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
    body("classification_id")
      .isInt()
      .withMessage("You must choose a valid classification."),
  ];
};

// Process validation result
invValidation.checkData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("message", "Please correct the errors below.");
    req.errors = errors.array();
    return next("validation-error"); // Custom trigger
  }
  next();
};

module.exports = invValidation;
