const { body } = require("express-validator");

const createLessonValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Lesson title is required")
    .isLength({ max: 200 })
    .withMessage("Title must be under 200 characters"),

  body("order")
    .notEmpty()
    .withMessage("Lesson order is required")
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),

  body("module")
    .notEmpty()
    .withMessage("Module ID is required")
    .isMongoId()
    .withMessage("Invalid Module ID format"),

  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string"),

  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),
];

const updateLessonValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title must be under 200 characters"),

  body("order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),

  body("duration")
    .optional()
    .isNumeric()
    .withMessage("Duration must be a number"),
];

module.exports = {
  createLessonValidator,
  updateLessonValidator,
};
