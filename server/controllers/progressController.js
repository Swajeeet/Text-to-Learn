const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const progressService = require("../services/progressService");

/**
 * GET /api/v1/progress/:courseId
 * Private — Get logged-in user's progress for a course
 */
const getCourseProgress = asyncHandler(async (req, res) => {
  const progress = await progressService.getCourseProgress(
    req.user._id,
    req.params.courseId
  );

  res.status(200).json(
    new ApiResponse(200, { progress }, "Progress fetched successfully")
  );
});

/**
 * POST /api/v1/progress/:courseId/complete
 * Private — Mark a lesson as complete
 * Body: { lessonId }
 */
const markLessonComplete = asyncHandler(async (req, res) => {
  const { lessonId } = req.body;

  if (!lessonId) {
    return res.status(400).json({
      success: false,
      message: "lessonId is required",
    });
  }

  const progress = await progressService.markLessonComplete(
    req.user._id,
    req.params.courseId,
    lessonId
  );

  res.status(200).json(
    new ApiResponse(
      200,
      { progress },
      "Lesson marked as complete"
    )
  );
});

module.exports = {
  getCourseProgress,
  markLessonComplete,
};
