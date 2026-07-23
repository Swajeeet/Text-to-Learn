const { Course } = require("../models");

const createCourse = async (courseData) => {
  const course = await Course.create(courseData);
  return course;
};

const getAllCourses = async () => {
  const courses = await Course.find();
  return courses;
};

const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId);

  return course;
};

const createGeneratedCourse = async (courseData) => {
  const course = await Course.create({
    title: courseData.title,
    description: courseData.description,
    difficulty: courseData.difficulty,
    estimatedDuration: courseData.estimatedDuration,
    language: "English",
    status: "Draft",
  });

  return course;
};

const updateCourse = async (courseId, updatedData) => {
  const course = await Course.findByIdAndUpdate(
    courseId,
    updatedData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  return course;
};

const deleteCourse = async (courseId) => {
  const course = await Course.findByIdAndDelete(courseId);

  return course;
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  createGeneratedCourse,
};