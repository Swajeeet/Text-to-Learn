const { Enrollment } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Enroll a user in a course.
 * Throws 409 if already enrolled.
 */
const enrollCourse = async (userId, courseId) => {
  const existing = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (existing) {
    throw new ApiError(409, "You are already enrolled in this course.");
  }

  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
  });

  return enrollment;
};

/**
 * Get all courses a user is enrolled in.
 */
const getUserEnrollments = async (userId) => {
  return await Enrollment.find({ user: userId }).populate(
    "course",
    "title description difficulty estimatedDuration status"
  );
};

/**
 * Check if a user is enrolled in a course.
 */
const checkEnrollment = async (userId, courseId) => {
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  return !!enrollment;
};

/**
 * Unenroll a user from a course.
 */
const unenrollCourse = async (userId, courseId) => {
  const enrollment = await Enrollment.findOneAndDelete({
    user: userId,
    course: courseId,
  });

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  return enrollment;
};

module.exports = {
  enrollCourse,
  getUserEnrollments,
  checkEnrollment,
  unenrollCourse,
};
