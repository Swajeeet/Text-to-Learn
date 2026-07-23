const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const lessonService = require("../services/lessonService");

/**
 * POST /api/v1/lessons
 * Create a new lesson
 */
const createLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.createLesson(req.body);

  res.status(201).json(
    new ApiResponse(201, { lesson }, "Lesson created successfully")
  );
});

/**
 * GET /api/v1/lessons/module/:moduleId
 * Get all lessons for a module
 */
const getLessonsByModule = asyncHandler(async (req, res) => {
  const lessons = await lessonService.getLessonsByModule(req.params.moduleId);

  res.status(200).json(
    new ApiResponse(
      200,
      { lessons, count: lessons.length },
      "Lessons fetched successfully"
    )
  );
});

/**
 * GET /api/v1/lessons/:id
 * Get a single lesson by ID
 */
const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await lessonService.getLessonById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, { lesson }, "Lesson fetched successfully")
  );
});

/**
 * PUT /api/v1/lessons/:id
 * Update a lesson
 */
const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.updateLesson(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse(200, { lesson }, "Lesson updated successfully")
  );
});

/**
 * DELETE /api/v1/lessons/:id
 * Delete a lesson
 */
const deleteLesson = asyncHandler(async (req, res) => {
  await lessonService.deleteLesson(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Lesson deleted successfully")
  );
});

module.exports = {
  createLesson,
  getLessonsByModule,
  getLessonById,
  updateLesson,
  deleteLesson,
};
