const { Lesson } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a single lesson.
 */
const createLesson = async (lessonData) => {
  const lesson = await Lesson.create(lessonData);
  return lesson;
};

/**
 * Get all lessons belonging to a module (sorted by order).
 */
const getLessonsByModule = async (moduleId) => {
  return await Lesson.find({ module: moduleId }).sort({ order: 1 });
};

/**
 * Get a single lesson by ID.
 */
const getLessonById = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId).populate(
    "module",
    "title course"
  );

  if (!lesson) {
    throw new ApiError(404, "Lesson not found.");
  }

  return lesson;
};

/**
 * Update a lesson.
 */
const updateLesson = async (lessonId, updateData) => {
  const lesson = await Lesson.findByIdAndUpdate(lessonId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!lesson) {
    throw new ApiError(404, "Lesson not found.");
  }

  return lesson;
};

/**
 * Delete a lesson by ID.
 */
const deleteLesson = async (lessonId) => {
  const lesson = await Lesson.findByIdAndDelete(lessonId);

  if (!lesson) {
    throw new ApiError(404, "Lesson not found.");
  }

  return lesson;
};

/**
 * Bulk-create lessons for AI-generated modules.
 * lessons = [{ title, content, summary, order, module }]
 */
const createGeneratedLessons = async (moduleId, lessons) => {
  const lessonDocuments = lessons.map((lesson, index) => ({
    title: lesson.title,
    content: lesson.content || "",
    summary: lesson.summary || "",
    videoQuery: lesson.videoQuery || lesson.title,
    order: index + 1,
    module: moduleId,
  }));

  return await Lesson.insertMany(lessonDocuments);
};

module.exports = {
  createLesson,
  getLessonsByModule,
  getLessonById,
  updateLesson,
  deleteLesson,
  createGeneratedLessons,
};
