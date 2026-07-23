const { body } = require("express-validator");

const createCourseValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Course title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("difficulty")
        .optional()
        .isIn(["Beginner", "Intermediate", "Advanced"])
        .withMessage("Invalid difficulty"),

    body("estimatedDuration")
        .optional()
        .isNumeric()
        .withMessage("Estimated duration must be a number"),
];

module.exports = {
    createCourseValidator,
};