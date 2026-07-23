const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const aiRoutes = require("./routes/aiRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");

// ── Middleware ────────────────────────────────────────────────────────────────
const errorMiddleware = require("./middlewares/errorMiddleware");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");

// ── Services (for PDF & YouTube inline routes) ────────────────────────────────
const { generateCoursePDF } = require("./services/pdfService");
const { searchVideos } = require("./services/youtubeService");
const { translateCourse } = require("./services/translationService");
const courseService = require("./services/courseService");
const moduleService = require("./services/moduleService");
const lessonService = require("./services/lessonService");
const asyncHandler = require("./utils/asyncHandler");
const ApiResponse = require("./utils/ApiResponse");
const ApiError = require("./utils/ApiError");
const { protect } = require("./middlewares/authMiddleware");

const app = express();

// ── Security Middlewares ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());

// Global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

// Strict limiter for auth routes — prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

app.use(globalLimiter);

// ── Body Parsing ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ────────────────────────────────────────────────────────────────────
app.use(morgan("dev"));

// ── Health Routes ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Text-to-Learn API 🚀",
    version: "1.0.0",
  });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Server Running",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/modules", moduleRoutes);
app.use("/api/v1/lessons", lessonRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/progress", progressRoutes);

// ── PDF Download Route ─────────────────────────────────────────────────────────
// GET /api/v1/courses/:id/pdf
app.get(
  "/api/v1/courses/:id/pdf",
  asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(req.params.id);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const modules = await moduleService.getModulesByCourse(req.params.id);

    // Build lessonsMap: { moduleId: [lessons] }
    const lessonsMap = {};
    await Promise.all(
      modules.map(async (mod) => {
        const lessons = await lessonService.getLessonsByModule(mod._id);
        lessonsMap[mod._id.toString()] = lessons;
      })
    );

    const pdfBuffer = await generateCoursePDF(course, modules, lessonsMap);

    const safeTitle = course.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeTitle}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  })
);

// ── YouTube Video Search Route ──────────────────────────────────────────────────
// GET /api/v1/youtube/search?q=<query>
app.get(
  "/api/v1/youtube/search",
  asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      throw new ApiError(400, "Query parameter 'q' is required");
    }

    const videos = await searchVideos(q.trim());

    res.status(200).json(
      new ApiResponse(200, { videos, count: videos.length }, "Videos fetched")
    );
  })
);

// ── Translation Route ───────────────────────────────────────────────────────────
// POST /api/v1/courses/:id/translate
// Body: { targetLanguage: "Spanish" }
app.post(
  "/api/v1/courses/:id/translate",
  asyncHandler(async (req, res) => {
    const { targetLanguage } = req.body;

    if (!targetLanguage) {
      throw new ApiError(400, "targetLanguage is required in the request body");
    }

    const course = await courseService.getCourseById(req.params.id);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const modules = await moduleService.getModulesByCourse(req.params.id);

    const { translatedCourse, translatedModules } = await translateCourse(
      course,
      modules,
      targetLanguage
    );

    res.status(200).json(
      new ApiResponse(
        200,
        { course: translatedCourse, modules: translatedModules },
        `Course translated to ${targetLanguage}`
      )
    );
  })
);

// ── Error Handlers (ALWAYS LAST) ───────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;