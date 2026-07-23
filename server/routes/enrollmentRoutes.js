const express = require("express");

const router = express.Router();

const enrollmentController = require("../controllers/enrollmentController");
const { protect } = require("../middlewares/authMiddleware");

// All enrollment routes require authentication
router.use(protect);

// POST /api/v1/enrollments
router.post("/", enrollmentController.enrollCourse);

// GET /api/v1/enrollments/my
router.get("/my", enrollmentController.getMyEnrollments);

// DELETE /api/v1/enrollments/:courseId
router.delete("/:courseId", enrollmentController.unenrollCourse);

module.exports = router;
