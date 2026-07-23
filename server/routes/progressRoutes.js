const express = require("express");

const router = express.Router();

const progressController = require("../controllers/progressController");
const { protect } = require("../middlewares/authMiddleware");

// All progress routes require authentication
router.use(protect);

// GET /api/v1/progress/:courseId
router.get("/:courseId", progressController.getCourseProgress);

// POST /api/v1/progress/:courseId/complete
router.post("/:courseId/complete", progressController.markLessonComplete);

module.exports = router;
