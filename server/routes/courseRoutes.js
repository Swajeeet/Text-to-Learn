const express = require("express");

const router = express.Router();

const courseController = require("../controllers/courseController");

const validate = require("../middlewares/validationMiddleware");

const {
  createCourseValidator,
} = require("../validators/courseValidator");

// Create Course
router.post(
  "/",
  createCourseValidator,
  validate,
  courseController.createCourse
);

// Get All Courses
router.get("/", courseController.getAllCourses);

// Get Single Course
router.get("/:id", courseController.getCourseById);

// Update Course
router.put("/:id", courseController.updateCourse);

// Delete Course
router.delete("/:id", courseController.deleteCourse);

module.exports = router;