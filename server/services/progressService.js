const { Progress, Lesson, Module } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Get or create a progress record for user+course.
 */
const getOrCreateProgress = async (userId, courseId) => {
  let progress = await Progress.findOne({
    user: userId,
    course: courseId,
  }).populate("completedLessons", "title order");

  if (!progress) {
    progress = await Progress.create({ user: userId, course: courseId });
  }

  return progress;
};

/**
 * Mark a lesson as complete for a user.
 * Recalculates progressPercent and isCompleted.
 */
const markLessonComplete = async (userId, courseId, lessonId) => {
  let progress = await Progress.findOne({ user: userId, course: courseId });

  if (!progress) {
    progress = await Progress.create({ user: userId, course: courseId });
  }

  // Avoid duplicates
  const alreadyCompleted = progress.completedLessons.some(
    (id) => id.toString() === lessonId
  );

  if (!alreadyCompleted) {
    progress.completedLessons.push(lessonId);
  }

  // Recalculate progress percentage
  // Count total lessons in the course (via module references)
  const modules = await Module.find({ course: courseId }).select("_id");
  const moduleIds = modules.map((m) => m._id);

  const totalLessons = await Lesson.countDocuments({
    module: { $in: moduleIds },
  });

  if (totalLessons > 0) {
    progress.progressPercent = Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    );
  }

  progress.isCompleted = progress.progressPercent === 100;

  await progress.save();

  return progress;
};

/**
 * Get a user's progress for a specific course.
 */
const getCourseProgress = async (userId, courseId) => {
  const progress = await Progress.findOne({
    user: userId,
    course: courseId,
  }).populate("completedLessons", "title order module");

  if (!progress) {
    return {
      completedLessons: [],
      progressPercent: 0,
      isCompleted: false,
    };
  }

  return progress;
};

module.exports = {
  getOrCreateProgress,
  markLessonComplete,
  getCourseProgress,
};
