const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const enrollmentService = require("../services/enrollmentService");

/**
 * POST /api/v1/enrollments
 * Private — Enroll logged-in user in a course
 */
const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "courseId is required",
    });
  }

  const enrollment = await enrollmentService.enrollCourse(
    req.user._id,
    courseId
  );

  res.status(201).json(
    new ApiResponse(201, { enrollment }, "Enrolled in course successfully")
  );
});

/**
 * GET /api/v1/enrollments/my
 * Private — Get all courses the logged-in user is enrolled in
 */
const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentService.getUserEnrollments(req.user._id);

  res.status(200).json(
    new ApiResponse(
      200,
      { enrollments, count: enrollments.length },
      "Enrollments fetched successfully"
    )
  );
});

/**
 * DELETE /api/v1/enrollments/:courseId
 * Private — Unenroll from a course
 */
const unenrollCourse = asyncHandler(async (req, res) => {
  await enrollmentService.unenrollCourse(req.user._id, req.params.courseId);

  res.status(200).json(
    new ApiResponse(200, null, "Unenrolled from course successfully")
  );
});

module.exports = {
  enrollCourse,
  getMyEnrollments,
  unenrollCourse,
};
