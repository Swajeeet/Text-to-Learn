const express = require("express");

const router = express.Router();

const lessonController = require("../controllers/lessonController");
const validate = require("../middlewares/validationMiddleware");
const {
  createLessonValidator,
  updateLessonValidator,
} = require("../validators/lessonValidator");

// POST /api/v1/lessons
router.post(
  "/",
  createLessonValidator,
  validate,
  lessonController.createLesson
);

// GET /api/v1/lessons/module/:moduleId
router.get("/module/:moduleId", lessonController.getLessonsByModule);

// GET /api/v1/lessons/:id
router.get("/:id", lessonController.getLessonById);

// PUT /api/v1/lessons/:id
router.put(
  "/:id",
  updateLessonValidator,
  validate,
  lessonController.updateLesson
);

// DELETE /api/v1/lessons/:id
router.delete("/:id", lessonController.deleteLesson);

module.exports = router;
