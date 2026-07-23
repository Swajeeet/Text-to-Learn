const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const geminiService = require("../services/geminiService");
const courseService = require("../services/courseService");
const moduleService = require("../services/moduleService");
const lessonService = require("../services/lessonService");

/**
 * Default lesson titles used as fallback when AI omits lessons for a module.
 * Applies to every module equally regardless of topic.
 */
const DEFAULT_LESSON_TITLES = [
  "Introduction",
  "Core Concepts",
  "Hands-on Examples",
  "Common Mistakes",
  "Summary & Next Steps",
];

/**
 * Build a fallback lesson array for a module when AI returns none.
 * @param {string} moduleTitle
 * @returns {Array<{title, summary, content, duration}>}
 */
const buildFallbackLessons = (moduleTitle) =>
  DEFAULT_LESSON_TITLES.map((lessonTitle) => ({
    title: `${lessonTitle}`,
    summary: `${lessonTitle} for ${moduleTitle}.`,
    content:
      `This lesson covers ${lessonTitle.toLowerCase()} related to ${moduleTitle}. ` +
      `You will explore the foundational ideas, understand how they apply in practice, ` +
      `and build a solid working knowledge of this topic. ` +
      `By the end of this lesson you will be able to confidently apply what you have learned ` +
      `to real-world problems and continue to deeper study.`,
    duration: 10,
  }));

const generateCourse = asyncHandler(async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({
      success: false,
      message: "Topic is required",
    });
  }

  // 1. Ask AI for course outline including lessons
  const generatedCourse = await geminiService.generateCourseOutline(topic);

  // 2. Save course
  const savedCourse = await courseService.createGeneratedCourse(generatedCourse);

  // 3. Save modules
  const savedModules = await moduleService.createGeneratedModules(
    savedCourse._id,
    generatedCourse.modules
  );

  // 4. Save lessons for every module
  //    - Use AI-provided lessons if available (and non-empty)
  //    - Fall back to default placeholders otherwise
  const lessonCreationPromises = savedModules.map((savedModule, index) => {
    const aiModule = generatedCourse.modules[index];
    const lessons =
      Array.isArray(aiModule?.lessons) && aiModule.lessons.length > 0
        ? aiModule.lessons
        : buildFallbackLessons(savedModule.title);

    return lessonService.createGeneratedLessons(savedModule._id, lessons);
  });

  const savedLessonsNested = await Promise.all(lessonCreationPromises);

  // Flatten for the response summary
  const savedLessons = savedLessonsNested.flat();

  res.status(201).json(
    new ApiResponse(
      201,
      {
        course: savedCourse,
        modules: savedModules,
        lessons: savedLessons,
      },
      "AI Course Generated Successfully"
    )
  );
});

module.exports = {
  generateCourse,
};