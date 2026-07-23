const courseService = require("../services/courseService");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/**
 * POST /api/v1/courses
 */
const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);

  res.status(201).json(
    new ApiResponse(201, { course }, "Course created successfully")
  );
});

/**
 * GET /api/v1/courses
 */
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await courseService.getAllCourses();

  res.status(200).json(
    new ApiResponse(
      200,
      { courses, count: courses.length },
      "Courses fetched successfully"
    )
  );
});

/**
 * GET /api/v1/courses/:id
 */
const getCourseById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  res.status(200).json(
    new ApiResponse(200, { course }, "Course fetched successfully")
  );
});

/**
 * PUT /api/v1/courses/:id
 */
const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  res.status(200).json(
    new ApiResponse(200, { course }, "Course updated successfully")
  );
});

/**
 * DELETE /api/v1/courses/:id
 */
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await courseService.deleteCourse(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  res.status(200).json(
    new ApiResponse(200, null, "Course deleted successfully")
  );
});

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};