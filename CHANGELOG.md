# Changelog — Text-to-Learn

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2025-07-01

### Initial Production Release 🚀

This is the first production-ready release of Text-to-Learn.

### Added

#### AI Course Generation
- Full AI-powered course generation from a single topic input
- Integration with OpenRouter API using the `openai` SDK (OpenAI-compatible)
- Default model: `deepseek/deepseek-r1-0528`
- Structured prompt engineering via `promptBuilder.js`
- AI response cleaning (strips markdown code fences) via `responseCleaner.js`
- JSON structure validation via `jsonValidator.js`
- Graceful fallback lesson system when AI omits module content
- Courses always generated with 5 modules × 5 lessons = 25 lessons total

#### Authentication
- User registration with name, email, and password
- User login with JWT token response
- Password hashing with bcryptjs (12 salt rounds)
- JWT-based stateless authentication
- Protected routes via `authMiddleware.protect()`
- Rate limiting on auth routes (20 requests per 15 minutes)

#### Course Management
- Create, read, update, delete (CRUD) courses
- Create, read, update, delete modules
- Create, read, update, delete lessons
- Case-insensitive course search by title
- Course enrollment and unenrollment
- Lesson progress tracking (mark as complete)

#### PDF Export
- Download any course as a formatted PDF
- PDF generated server-side using PDFKit
- Includes course metadata, all modules, and all lessons
- Safe filename derived from course title

#### YouTube Recommendations
- Per-lesson YouTube video search via YouTube Data API v3
- Returns video ID, title, thumbnail, and channel name
- Videos rendered as iframe embeds in LessonViewer

#### AI Translation
- Translate course content to any target language via AI
- `POST /api/v1/courses/:id/translate` endpoint
- Uses OpenRouter for translation

#### User Profiles
- User profile view and edit
- Avatar URL support
- Role system: student and admin

#### Frontend
- React 19 + Vite 8 single-page application
- Tailwind CSS 4 for styling
- React Router v7 for client-side routing
- AuthContext with localStorage persistence
- Centralized Axios API layer with auth interceptors
- Toast notifications via react-hot-toast
- Pages: Home, Login, Register, Dashboard, GenerateCourse, CourseDetails, LessonViewer, MyCourses, Profile, NotFound
- Protected and public route wrappers

#### Backend Architecture
- Express.js 5 REST API
- Mongoose 9 ODM for MongoDB
- Layered architecture: Routes → Controllers → Services → Models
- `asyncHandler` wrapper for clean error handling
- Standardized `ApiResponse` and `ApiError` classes
- `express-validator` for request body validation
- Helmet.js for HTTP security headers
- Global rate limiting (100 requests per 15 minutes)
- Morgan HTTP request logging

#### Database
- MongoDB Atlas cloud database
- 6 collections: Users, Courses, Modules, Lessons, Enrollments, Progress
- Timestamps on all documents

#### Deployment
- Frontend deployed on Vercel
- Backend deployed on Railway
- Database hosted on MongoDB Atlas

#### Documentation
- Comprehensive README with badges, architecture, tech stack, API reference
- `docs/Architecture.md` with Mermaid diagrams
- `docs/API.md` with complete endpoint reference
- `docs/Deployment.md` with step-by-step deployment guide
- `docs/ProjectStructure.md` with annotated file tree
- `docs/Authentication.md`, `docs/AI.md`, `docs/Database.md`
- `docs/PDF.md`, `docs/YouTube.md`, `docs/Search.md`
- `CONTRIBUTING.md` with development guide and commit conventions
- `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1)
- `SECURITY.md` with vulnerability reporting process
- `ROADMAP.md` with planned features
- GitHub issue templates and PR template

---

## Planned — [1.1.0]

See [ROADMAP.md](./ROADMAP.md) for upcoming features.

---

[1.0.0]: https://github.com/Swajeeet/Text-to-Learn/releases/tag/v1.0.0
