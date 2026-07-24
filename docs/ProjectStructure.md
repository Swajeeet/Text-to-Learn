# Project Structure — Text-to-Learn

A detailed breakdown of every file and directory in the Text-to-Learn repository.

---

## Root Directory

```
Text-to-Learn/
├── .github/                     # GitHub configuration and templates
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── feature_request.md
│       └── question.md
│   └── pull_request_template.md
├── client/                      # React + Vite frontend application
├── docs/                        # Project documentation
├── server/                      # Express.js backend API
├── .gitignore                   # Git ignore rules (root-level)
├── CHANGELOG.md                 # Version history and release notes
├── CODE_OF_CONDUCT.md           # Community code of conduct
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # MIT License
├── README.md                    # Project overview and documentation
├── ROADMAP.md                   # Future features and milestones
└── SECURITY.md                  # Security policy and vulnerability reporting
```

---

## `/client` — Frontend

```
client/
├── public/
│   └── vite.svg                 # Vite default public asset
│
├── src/
│   │
│   ├── api/                     # All API communication modules
│   │   ├── axios.js             # Configured Axios instance
│   │   │                        # • Sets baseURL from VITE_API_URL
│   │   │                        # • Attaches Authorization header from localStorage
│   │   ├── authApi.js           # Authentication API calls
│   │   │                        # • register(name, email, password)
│   │   │                        # • login(email, password)
│   │   │                        # • getProfile()
│   │   │                        # • updateProfile(data)
│   │   ├── aiApi.js             # AI generation API calls
│   │   │                        # • generateCourse(topic)
│   │   ├── courseApi.js         # Course listing API calls
│   │   │                        # • getAllCourses(searchQuery)
│   │   │                        # • getCourseById(id)
│   │   ├── courseDetailsApi.js  # Course + module details API calls
│   │   │                        # • getModulesByCourse(courseId)
│   │   ├── lessonApi.js         # Lesson API calls
│   │   │                        # • getLessonsByModule(moduleId)
│   │   │                        # • getLessonById(id)
│   │   ├── pdfApi.js            # PDF download API call
│   │   │                        # • downloadCoursePDF(courseId)
│   │   ├── progressApi.js       # Progress API calls
│   │   │                        # • getCourseProgress(courseId)
│   │   │                        # • markLessonComplete(courseId, lessonId)
│   │   └── youtubeApi.js        # YouTube search API call
│   │                            # • searchYouTubeVideos(query)
│   │
│   ├── components/              # Reusable UI components
│   │   └── Navbar.jsx           # Global navigation bar
│   │                            # • Shows app logo/title
│   │                            # • Authenticated: Dashboard, Generate, My Courses, Profile, Logout
│   │                            # • Unauthenticated: Login, Register links
│   │
│   ├── context/                 # React Context providers
│   │   └── AuthContext.jsx      # Authentication context
│   │                            # • Stores: user, token, loading state
│   │                            # • Provides: login(), logout(), register() helpers
│   │                            # • Persists token to localStorage on login
│   │                            # • Reads token from localStorage on mount
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── useAuth.js           # Shorthand hook for AuthContext
│   │                            # • Returns useContext(AuthContext)
│   │                            # • Throws if used outside AuthProvider
│   │
│   ├── layouts/                 # Page layout wrappers
│   │   └── MainLayout.jsx       # Primary layout component
│   │                            # • Renders <Navbar /> at top
│   │                            # • Renders <Outlet /> for child routes
│   │
│   ├── pages/                   # Route-level page components (one per route)
│   │   ├── Home.jsx             # Landing page
│   │   │                        # • Hero section with call-to-action
│   │   │                        # • Feature highlights
│   │   │                        # • Links to Register/Login
│   │   ├── Login.jsx            # Login page
│   │   │                        # • Email + password form
│   │   │                        # • Calls authApi.login()
│   │   │                        # • Stores token via AuthContext
│   │   │                        # • Redirects to /dashboard on success
│   │   ├── Register.jsx         # Registration page
│   │   │                        # • Name, email, password form
│   │   │                        # • Calls authApi.register()
│   │   │                        # • Auto-login after registration
│   │   ├── Dashboard.jsx        # Authenticated dashboard
│   │   │                        # • Welcome message with user name
│   │   │                        # • Quick links to Generate Course, My Courses
│   │   ├── GenerateCourse.jsx   # AI course generation page
│   │   │                        # • Topic input form
│   │   │                        # • Calls aiApi.generateCourse(topic)
│   │   │                        # • Loading state during generation
│   │   │                        # • Redirects to /courses/:id on success
│   │   ├── CourseDetails.jsx    # Course detail and module list page
│   │   │                        # • Displays course metadata (title, difficulty, duration)
│   │   │                        # • Lists all modules with lesson previews
│   │   │                        # • PDF download button
│   │   │                        # • Enroll/unenroll functionality
│   │   ├── LessonViewer.jsx     # Individual lesson reader
│   │   │                        # • Displays lesson title, summary, content
│   │   │                        # • Shows estimated duration
│   │   │                        # • YouTube video recommendations sidebar
│   │   │                        # • Mark as complete button
│   │   │                        # • Previous/Next lesson navigation
│   │   ├── MyCourses.jsx        # User's enrolled/generated courses
│   │   │                        # • Lists courses user has enrolled in
│   │   │                        # • Shows course cards with metadata
│   │   │                        # • Links to CourseDetails
│   │   ├── Profile.jsx          # User profile page
│   │   │                        # • Displays user name, email, avatar
│   │   │                        # • Edit profile form
│   │   └── NotFound.jsx         # 404 Not Found page
│   │
│   ├── routes/                  # React Router route configuration
│   │   ├── AppRoutes.jsx        # Defines all app routes using React Router v7
│   │   │                        # • / → Home (public)
│   │   │                        # • /login → Login (public only)
│   │   │                        # • /register → Register (public only)
│   │   │                        # • /dashboard → Dashboard (private)
│   │   │                        # • /generate → GenerateCourse (private)
│   │   │                        # • /courses/:id → CourseDetails (public)
│   │   │                        # • /lessons/:id → LessonViewer (public)
│   │   │                        # • /my-courses → MyCourses (private)
│   │   │                        # • /profile → Profile (private)
│   │   │                        # • * → NotFound
│   │   ├── PrivateRoute.jsx     # Auth-protected route wrapper
│   │   │                        # • Checks AuthContext for authenticated user
│   │   │                        # • Redirects to /login if not authenticated
│   │   └── PublicRoute.jsx      # Public-only route wrapper
│   │                            # • Redirects to /dashboard if already authenticated
│   │
│   ├── App.jsx                  # Root component — wraps app in AuthProvider
│   ├── App.css                  # Global CSS styles
│   ├── index.css                # Tailwind CSS base imports
│   └── main.jsx                 # React DOM root — renders <App /> into #root
│
├── .env                         # Local environment variables (git-ignored)
├── .env.example                 # Environment variable template
├── .gitignore                   # Frontend-specific git ignore rules
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML shell with <div id="root">
├── package.json                 # Dependencies and npm scripts
└── vite.config.js               # Vite build and dev server config
```

---

## `/server` — Backend

```
server/
│
├── config/                      # Application configuration modules
│   ├── db.js                    # MongoDB Atlas connection
│   │                            # • Calls mongoose.connect(MONGODB_URI)
│   │                            # • Logs connection success/failure
│   ├── env.js                   # Environment variable loader
│   │                            # • Calls dotenv.config()
│   │                            # • Validates required variables are present
│   ├── auth.js                  # JWT utility functions
│   │                            # • signToken(userId) → JWT string
│   │                            # • verifyToken(token) → decoded payload
│   ├── openrouter.js            # OpenRouter client factory
│   │                            # • getOpenRouterClient() — lazy singleton
│   │                            # • Creates openai SDK client with OpenRouter base URL
│   └── gemini.js                # Google Gemini SDK configuration
│
├── constants/                   # Application-wide constants
│   └── aiConstants.js           # DEFAULT_MODEL — OpenRouter model string
│
├── controllers/                 # Express route handler functions
│   ├── authController.js        # Handles auth HTTP requests
│   │                            # • register() — delegates to userService
│   │                            # • login() — delegates to userService
│   │                            # • getProfile() — fetches req.user from DB
│   │                            # • updateProfile() — delegates to userService
│   ├── aiController.js          # Handles AI generation requests
│   │                            # • generateCourse() — orchestrates full pipeline:
│   │                            #   1. Call geminiService for course outline
│   │                            #   2. Save course via courseService
│   │                            #   3. Save modules via moduleService
│   │                            #   4. Save lessons via lessonService (or fallback)
│   ├── courseController.js      # Handles course CRUD
│   │                            # • createCourse, getAllCourses, getCourseById
│   │                            # • updateCourse, deleteCourse
│   ├── moduleController.js      # Handles module CRUD
│   │                            # • createModule, getModulesByCourse
│   │                            # • getModuleById, updateModule, deleteModule
│   ├── lessonController.js      # Handles lesson CRUD
│   │                            # • createLesson, getLessonsByModule
│   │                            # • getLessonById, updateLesson, deleteLesson
│   ├── enrollmentController.js  # Handles enrollment operations
│   │                            # • enrollCourse, getMyEnrollments, unenrollCourse
│   ├── progressController.js    # Handles progress tracking
│   │                            # • getCourseProgress, markLessonComplete
│   └── userController.js        # Additional user utility handlers
│
├── middlewares/                 # Express middleware functions
│   ├── authMiddleware.js        # JWT authentication middleware
│   │                            # • protect() — extracts and verifies Bearer token
│   │                            # • Sets req.user to authenticated user object
│   │                            # • Throws 401 if token missing or invalid
│   ├── errorMiddleware.js       # Global error handler (last middleware)
│   │                            # • Catches all errors forwarded via next(err)
│   │                            # • Returns standardized error JSON
│   ├── notFoundMiddleware.js    # 404 catch-all middleware
│   │                            # • Catches requests to undefined routes
│   │                            # • Returns 404 JSON response
│   └── validationMiddleware.js  # express-validator result processor
│                                # • validate() — reads validationResult(req)
│                                # • Returns 400 with validation errors if any
│
├── models/                      # Mongoose schema definitions
│   ├── User.js                  # User model
│   │                            # Fields: name, email, password, picture, role
│   │                            # Pre-save hook: bcrypt password hashing
│   │                            # Method: comparePassword()
│   ├── Course.js                # Course model
│   │                            # Fields: title, description, difficulty,
│   │                            #   estimatedDuration, thumbnail, language,
│   │                            #   status, createdBy (ref: User)
│   ├── Module.js                # Module model
│   │                            # Fields: title, description, courseId (ref: Course)
│   ├── Lesson.js                # Lesson model
│   │                            # Fields: title, summary, content, duration,
│   │                            #   moduleId (ref: Module)
│   ├── Enrollment.js            # Enrollment model
│   │                            # Fields: userId (ref: User), courseId (ref: Course)
│   ├── Progress.js              # Progress model
│   │                            # Fields: userId, courseId, completedLessons[]
│   └── index.js                 # Barrel: re-exports all models
│
├── routes/                      # Express Router definitions
│   ├── authRoutes.js            # /api/v1/auth/*
│   │                            # POST /register — public
│   │                            # POST /login — public
│   │                            # GET /profile — protected
│   │                            # PUT /profile — protected
│   ├── aiRoutes.js              # /api/v1/ai/*
│   │                            # POST /generate-course — public
│   ├── courseRoutes.js          # /api/v1/courses/*
│   │                            # CRUD + PDF + translate inline routes in app.js
│   ├── moduleRoutes.js          # /api/v1/modules/*
│   │                            # CRUD for modules
│   ├── lessonRoutes.js          # /api/v1/lessons/*
│   │                            # CRUD for lessons
│   ├── enrollmentRoutes.js      # /api/v1/enrollments/*
│   │                            # All routes protected via router.use(protect)
│   └── progressRoutes.js        # /api/v1/progress/*
│                                # All routes protected via router.use(protect)
│
├── services/                    # Business logic layer (called by controllers)
│   ├── geminiService.js         # AI course outline generation
│   │                            # • generateCourseOutline(topic)
│   │                            # • Calls OpenRouter with buildCoursePrompt
│   │                            # • Cleans + parses + validates AI response
│   ├── courseService.js         # Course database operations
│   │                            # • createGeneratedCourse(courseJSON)
│   │                            # • getAllCourses(searchQuery)
│   │                            # • getCourseById(id)
│   │                            # • updateCourse(id, data)
│   │                            # • deleteCourse(id)
│   ├── moduleService.js         # Module database operations
│   │                            # • createGeneratedModules(courseId, modules[])
│   │                            # • getModulesByCourse(courseId)
│   │                            # • getModuleById(id)
│   ├── lessonService.js         # Lesson database operations
│   │                            # • createGeneratedLessons(moduleId, lessons[])
│   │                            # • getLessonsByModule(moduleId)
│   │                            # • getLessonById(id)
│   ├── enrollmentService.js     # Enrollment database operations
│   │                            # • enrollCourse(userId, courseId)
│   │                            # • getMyEnrollments(userId)
│   │                            # • unenrollCourse(userId, courseId)
│   ├── progressService.js       # Progress tracking operations
│   │                            # • getCourseProgress(userId, courseId)
│   │                            # • markLessonComplete(userId, courseId, lessonId)
│   ├── userService.js           # User business logic
│   │                            # • register(name, email, password)
│   │                            # • login(email, password)
│   │                            # • getUserById(id)
│   │                            # • updateProfile(id, data)
│   ├── pdfService.js            # PDF generation using PDFKit
│   │                            # • generateCoursePDF(course, modules, lessonsMap)
│   │                            # • Returns Buffer (PDF binary)
│   ├── youtubeService.js        # YouTube search integration
│   │                            # • searchVideos(query)
│   │                            # • Calls YouTube Data API v3
│   │                            # • Returns normalized video array
│   └── translationService.js    # AI translation service
│                                # • translateCourse(course, modules, targetLanguage)
│                                # • Uses OpenRouter to translate course content
│
├── utils/                       # Utility helper modules
│   ├── asyncHandler.js          # Async controller wrapper
│   │                            # • Wraps async fn in try/catch
│   │                            # • Forwards errors to next() middleware
│   ├── ApiResponse.js           # Success response class
│   │                            # new ApiResponse(statusCode, data, message)
│   ├── ApiError.js              # HTTP error class
│   │                            # new ApiError(statusCode, message)
│   └── ai/                      # AI-specific utilities
│       ├── promptBuilder.js     # LLM prompt construction
│       │                        # • buildCoursePrompt(topic) → prompt string
│       │                        # • Instructs AI: return JSON, 5 modules, 5 lessons
│       ├── responseCleaner.js   # AI response normalization
│       │                        # • cleanResponse(text) → clean JSON string
│       │                        # • Strips ```json ... ``` markdown fences
│       │                        # • Handles multiple fence variations
│       └── jsonValidator.js     # Course JSON structure validator
│                                # • validateCourseJSON(obj) → throws if invalid
│                                # • Checks: title, description, modules[], lessons[]
│
├── validators/                  # Input validation rule sets (express-validator)
│   ├── authValidator.js         # Auth validation chains
│   │                            # • registerValidator — name, email, password
│   │                            # • loginValidator — email, password
│   │                            # • updateProfileValidator — optional fields
│   ├── courseValidator.js       # Course validation chains
│   │                            # • createCourseValidator — title, description
│   └── lessonValidator.js       # Lesson validation chains
│                                # • createLessonValidator, updateLessonValidator
│
├── .env                         # Local server env variables (git-ignored)
├── .env.example                 # Server env variable template
├── .gitignore                   # Server-specific git ignore rules
├── app.js                       # Express application setup
│                                # • Imports and configures all middleware
│                                # • Mounts all routers
│                                # • Defines inline routes (PDF, YouTube, Translate)
│                                # • Mounts error handlers (always last)
├── package.json                 # Server dependencies and scripts
└── server.js                    # Entry point
                                 # • Imports env config
                                 # • Connects to MongoDB
                                 # • Starts HTTP server on PORT
```

---

## `/docs` — Documentation

```
docs/
├── AI.md                        # AI integration guide (prompt engineering, OpenRouter)
├── API.md                       # Complete REST API reference
├── Architecture.md              # System architecture with Mermaid diagrams
├── Authentication.md            # JWT auth flow documentation
├── Database.md                  # MongoDB schema and data model documentation
├── Deployment.md                # Production deployment guide (Vercel, Railway, Atlas)
├── PDF.md                       # PDF generation documentation
├── ProjectStructure.md          # This file — detailed file/folder breakdown
├── Search.md                    # Course search feature documentation
└── YouTube.md                   # YouTube recommendation feature documentation
```

---

## `/.github` — GitHub Configuration

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md            # Bug report issue template
│   ├── feature_request.md       # Feature request issue template
│   └── question.md              # Question/help issue template
└── pull_request_template.md     # Pull request description template
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **`asyncHandler` wrapper** | Eliminates repetitive try/catch blocks in every controller |
| **`ApiResponse` / `ApiError` classes** | Enforces a consistent JSON response envelope across all endpoints |
| **Service layer** | Separates business logic from HTTP concerns; controllers stay thin |
| **Lazy OpenRouter client** | `getOpenRouterClient()` called at request time ensures `.env` is loaded before initialization |
| **Parallel lesson creation** | `Promise.all()` for writing lessons across modules dramatically reduces DB write time |
| **Fallback lesson builder** | Ensures every module always has lessons even if AI truncates output |
| **`select: false` on password** | Password hash is never accidentally returned in user queries |
