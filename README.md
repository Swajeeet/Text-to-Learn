<div align="center">

# 🎓 Text-to-Learn

### AI-Powered Learning Platform — Turn Any Topic Into a Complete Course

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://text-to-learn-nu.vercel.app)
[![API Health](https://img.shields.io/badge/⚡_API-Render-46E3B7?style=for-the-badge&logo=render)](https://text-to-learn-dzhm.onrender.com/api/v1/health)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](./CONTRIBUTING.md)

<br/>

> **Text-to-Learn** is a production-ready, full-stack AI SaaS application that converts any topic into a complete structured learning course — complete with modules, lessons, difficulty ratings, estimated durations, and YouTube video recommendations — powered by Large Language Models via OpenRouter.

<br/>

**[🌐 Live App](https://text-to-learn-nu.vercel.app) · [📡 API Docs](./docs/API.md) · [🏗️ Architecture](./docs/Architecture.md) · [🤝 Contribute](./CONTRIBUTING.md) · [🗺️ Roadmap](./ROADMAP.md)**

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Reference](#-api-reference)
- [☁️ Deployment](#️-deployment)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [⚠️ Known Limitations](#️-known-limitations)
- [💡 Why This Project](#-why-this-project)
- [📄 License](#-license)
- [👤 Author](#-author)

---

## ✨ Features

### 🤖 AI Course Generation
| Feature | Description |
|---|---|
| **Instant Course Creation** | Enter any topic → get a complete structured course in seconds |
| **5 Modules × 5 Lessons** | Every course is generated with exactly 5 modules, each containing 5 lessons |
| **Rich Lesson Content** | Every lesson includes a title, summary, detailed content, and estimated duration |
| **Course Metadata** | AI generates title, description, difficulty level, and estimated total duration |
| **Fallback Handling** | Graceful fallback lessons if the AI omits any module content |
| **JSON Validation** | Every AI response is cleaned, parsed, and structurally validated before saving |

### 🔐 Authentication & Security
| Feature | Description |
|---|---|
| **JWT Authentication** | Stateless, token-based auth using `jsonwebtoken` |
| **Password Hashing** | `bcryptjs` with 12 salt rounds |
| **Protected Routes** | Server-side `protect` middleware on private endpoints |
| **Rate Limiting** | 100 req/15 min globally; 20 req/15 min on auth routes (brute-force prevention) |
| **Helmet.js** | HTTP security headers on all responses |

### 📚 Learning Experience
| Feature | Description |
|---|---|
| **My Courses** | Authenticated users can save and revisit all their generated courses |
| **Course Search** | Search and browse all available courses by title |
| **Lesson Viewer** | Structured, lesson-by-lesson content reader |
| **YouTube Recommendations** | Per-lesson YouTube video suggestions via YouTube Data API v3 |
| **PDF Export** | Download any full course as a professionally formatted PDF |
| **Progress Tracking** | Mark lessons as complete; track progress per course |
| **Course Enrollment** | Enroll and unenroll from courses; view enrollment history |

### 👤 User Features
| Feature | Description |
|---|---|
| **User Profile** | View and update name, email, and avatar |
| **Personalized Dashboard** | Welcome dashboard with quick access to courses |
| **Role System** | Student and Admin roles defined on the User model |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT (React + Vite)                       │
│  Pages: Home · Login · Register · Dashboard · GenerateCourse    │
│         CourseDetails · LessonViewer · MyCourses · Profile      │
│  Context: AuthContext → useAuth hook                            │
│  API Layer: Axios instance with interceptors → /api/v1          │
└────────────────────────────┬────────────────────────────────────┘
                             │  HTTPS REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SERVER (Express.js + Node.js)                  │
│  Routes → Controllers → Services → Models (Mongoose)           │
│  Middlewares: auth · error · rate-limit · validation           │
│  Utils: asyncHandler · ApiResponse · ApiError                  │
└──────────────┬──────────────────────┬───────────────────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────┐   ┌──────────────────────────────────────┐
│    MongoDB Atlas     │   │           External APIs               │
│   Collections:       │   │  ┌─────────────────────────────────┐ │
│   • Users            │   │  │ OpenRouter API (LLM Generation) │ │
│   • Courses          │   │  └─────────────────────────────────┘ │
│   • Modules          │   │  ┌─────────────────────────────────┐ │
│   • Lessons          │   │  │ YouTube Data API v3             │ │
│   • Enrollments      │   │  └─────────────────────────────────┘ │
│   • Progress         │   └──────────────────────────────────────┘
└──────────────────────┘
```

### Course Generation Flow

```
User Input (topic)
      │
      ▼
promptBuilder.js  ──→  Structured AI Prompt
      │
      ▼
OpenRouter API    ──→  LLM Raw Text Response
      │
      ▼
responseCleaner.js  ──→  Strip markdown fences
      │
      ▼
JSON.parse()  ──→  JavaScript Object
      │
      ▼
jsonValidator.js  ──→  Validate required fields & structure
      │
      ▼
MongoDB Atlas (parallel writes):
  courseService.createGeneratedCourse()
  moduleService.createGeneratedModules()
  lessonService.createGeneratedLessons()
      │
      ▼
201 Response → Client → Redirected to CourseDetails
```

> 📐 Full Mermaid architecture diagrams: [docs/Architecture.md](./docs/Architecture.md)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI component framework |
| **Vite** | 8 | Build tool and dev server |
| **React Router DOM** | 7 | Client-side routing |
| **Tailwind CSS** | 4 | Utility-first CSS framework |
| **Axios** | 1.x | HTTP client with interceptors |
| **React Hot Toast** | 2.x | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 18 | JavaScript runtime |
| **Express.js** | 5 | Web application framework |
| **Mongoose** | 9 | MongoDB ODM |
| **jsonwebtoken** | 9 | JWT creation and verification |
| **bcryptjs** | 3 | Password hashing |
| **openai** SDK | 6 | OpenRouter client (OpenAI-compatible) |
| **@google/genai** | 2 | Google Gemini SDK |
| **PDFKit** | 0.19 | Programmatic PDF generation |
| **Helmet** | 8 | HTTP security headers |
| **express-rate-limit** | 8 | Rate limiting middleware |
| **express-validator** | 7 | Request body validation |
| **Morgan** | 1 | HTTP request logging |

### Cloud & Infrastructure
| Service | Purpose |
|---|---|
| **MongoDB Atlas** | Managed cloud NoSQL database |
| **Render** | Backend hosting and deployment |
| **Vercel** | Frontend hosting and CDN |
| **OpenRouter** | AI model routing and LLM API access |
| **YouTube Data API v3** | Educational video recommendations |

---

## 📁 Project Structure

```
Text-to-Learn/
├── client/                          # React + Vite Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── api/                     # Axios API call modules
│   │   │   ├── axios.js             # Axios instance (base URL + auth interceptor)
│   │   │   ├── authApi.js           # register, login, getProfile, updateProfile
│   │   │   ├── aiApi.js             # generateCourse
│   │   │   ├── courseApi.js         # getAllCourses, getCourseById
│   │   │   ├── courseDetailsApi.js  # getModules, full course data
│   │   │   ├── lessonApi.js         # getLessonsByModule, getLessonById
│   │   │   ├── pdfApi.js            # downloadCoursePDF
│   │   │   ├── progressApi.js       # getCourseProgress, markLessonComplete
│   │   │   └── youtubeApi.js        # searchYouTubeVideos
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Global navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state, login/logout/register helpers
│   │   ├── hooks/
│   │   │   └── useAuth.js           # useContext(AuthContext) shorthand hook
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx       # Navbar + <Outlet> page wrapper
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Register.jsx         # Registration form
│   │   │   ├── Dashboard.jsx        # Authenticated user dashboard
│   │   │   ├── GenerateCourse.jsx   # AI course generation UI
│   │   │   ├── CourseDetails.jsx    # Course overview + module list
│   │   │   ├── LessonViewer.jsx     # Lesson reader + YouTube recommendations
│   │   │   ├── MyCourses.jsx        # User's saved/enrolled courses
│   │   │   ├── Profile.jsx          # User profile view and edit
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx        # All application route definitions
│   │   │   ├── PrivateRoute.jsx     # Auth-guarded route wrapper
│   │   │   └── PublicRoute.jsx      # Redirect-if-authenticated wrapper
│   │   ├── App.jsx                  # Root app component
│   │   └── main.jsx                 # React DOM entry point
│   ├── .env.example                 # Frontend env variable template
│   ├── index.html                   # HTML shell with meta tags
│   ├── vite.config.js               # Vite configuration
│   └── package.json
│
└── server/                          # Express.js Backend
    ├── config/
    │   ├── db.js                    # MongoDB Atlas connection helper
    │   ├── env.js                   # Environment variable loader and validator
    │   ├── auth.js                  # JWT sign and verify helpers
    │   ├── openrouter.js            # Lazily-initialized OpenRouter client
    │   └── gemini.js                # Google Gemini client configuration
    ├── constants/
    │   └── aiConstants.js           # Default AI model identifier
    ├── controllers/
    │   ├── authController.js        # register, login, getProfile, updateProfile
    │   ├── aiController.js          # generateCourse (AI pipeline orchestrator)
    │   ├── courseController.js      # CRUD operations for courses
    │   ├── moduleController.js      # CRUD operations for modules
    │   ├── lessonController.js      # CRUD operations for lessons
    │   ├── enrollmentController.js  # enroll, getMyEnrollments, unenroll
    │   ├── progressController.js    # getCourseProgress, markLessonComplete
    │   └── userController.js        # User utility operations
    ├── middlewares/
    │   ├── authMiddleware.js        # protect() — JWT verification and user injection
    │   ├── errorMiddleware.js       # Global async error handler
    │   ├── notFoundMiddleware.js    # 404 catch-all handler
    │   └── validationMiddleware.js  # express-validator result processor
    ├── models/
    │   ├── User.js                  # User schema (name, email, password, role)
    │   ├── Course.js                # Course schema (title, difficulty, duration, status)
    │   ├── Module.js                # Module schema (title, description, courseId ref)
    │   ├── Lesson.js                # Lesson schema (title, content, summary, duration)
    │   ├── Enrollment.js            # Enrollment schema (userId, courseId)
    │   ├── Progress.js              # Progress schema (userId, courseId, completedLessons)
    │   └── index.js                 # Barrel export for all models
    ├── routes/
    │   ├── authRoutes.js            # POST /register, POST /login, GET/PUT /profile
    │   ├── aiRoutes.js              # POST /generate-course
    │   ├── courseRoutes.js          # CRUD /courses
    │   ├── moduleRoutes.js          # CRUD /modules
    │   ├── lessonRoutes.js          # CRUD /lessons
    │   ├── enrollmentRoutes.js      # /enrollments (auth protected)
    │   └── progressRoutes.js        # /progress (auth protected)
    ├── services/
    │   ├── geminiService.js         # OpenRouter API integration and response pipeline
    │   ├── courseService.js         # Course business logic and DB operations
    │   ├── moduleService.js         # Module business logic and DB operations
    │   ├── lessonService.js         # Lesson business logic and DB operations
    │   ├── enrollmentService.js     # Enrollment business logic and DB operations
    │   ├── progressService.js       # Progress tracking logic and DB operations
    │   ├── userService.js           # User register, login, update logic
    │   ├── pdfService.js            # PDFKit-based course PDF generation
    │   ├── youtubeService.js        # YouTube Data API v3 video search
    │   └── translationService.js    # AI-powered course content translation
    ├── utils/
    │   ├── asyncHandler.js          # Wraps async controllers; forwards errors to middleware
    │   ├── ApiResponse.js           # Standardized success response envelope
    │   ├── ApiError.js              # Standardized HTTP error class
    │   └── ai/
    │       ├── promptBuilder.js     # Constructs structured LLM prompts from topic input
    │       ├── responseCleaner.js   # Strips markdown code fences from AI output
    │       └── jsonValidator.js     # Validates AI-generated course JSON structure
    ├── validators/
    │   ├── authValidator.js         # Validation rules for register/login/updateProfile
    │   ├── courseValidator.js       # Validation rules for createCourse
    │   └── lessonValidator.js       # Validation rules for createLesson/updateLesson
    ├── app.js                       # Express app: middleware stack + route mounting
    ├── server.js                    # HTTP server entry point (DB connect + listen)
    ├── .env.example                 # Backend env variable template
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **MongoDB Atlas** account — [Create free cluster](https://www.mongodb.com/cloud/atlas)
- **OpenRouter API key** — [openrouter.ai](https://openrouter.ai)
- **YouTube Data API v3 key** — [Google Cloud Console](https://console.cloud.google.com)

### 1. Clone the Repository

```bash
git clone https://github.com/Swajeeet/Text-to-Learn.git
cd Text-to-Learn
```

### 2. Install Dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Configure Environment Variables

```bash
# Backend
cp server/.env.example server/.env
# Edit server/.env with your real values

# Frontend
cp client/.env.example client/.env
# Edit client/.env — set VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Start the Development Servers

Open **two terminals**:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client
npm run dev
```

### 5. Verify Everything is Running

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/api/v1/health |

---

## ⚙️ Environment Variables

### Backend — `server/.env`

| Variable | Required | Example | Description |
|---|---|---|---|
| `PORT` | ✅ | `5000` | Port the Express server listens on |
| `MONGODB_URI` | ✅ | `mongodb+srv://user:pass@cluster.mongodb.net/db` | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | `your-secret-key-min-32-chars` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | ✅ | `7d` | JWT expiry duration (e.g. `7d`, `24h`) |
| `OPENROUTER_API_KEY` | ✅ | `sk-or-v1-...` | OpenRouter API key for LLM access |
| `YOUTUBE_API_KEY` | ✅ | `AIzaSy...` | YouTube Data API v3 key |

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/text-to-learn
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
JWT_EXPIRES_IN=7d
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Frontend — `client/.env`

| Variable | Required | Example | Description |
|---|---|---|---|
| `VITE_API_URL` | ✅ | `http://localhost:5000/api/v1` | Base URL of the backend REST API |

```env
# Local development
VITE_API_URL=http://localhost:5000/api/v1

# Production
# VITE_API_URL=https://text-to-learn-dzhm.onrender.com/api/v1
```

> 📖 Full deployment environment guide: [docs/Deployment.md](./docs/Deployment.md)

---

## 📡 API Reference

**Base URL:** `https://text-to-learn-dzhm.onrender.com/api/v1`

### 🔐 Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Create new user account |
| `POST` | `/auth/login` | ❌ | Login and receive JWT |
| `GET` | `/auth/profile` | ✅ | Get logged-in user profile |
| `PUT` | `/auth/profile` | ✅ | Update user profile |

### 🤖 AI Generation

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/ai/generate-course` | ✅ | Generate complete course from topic |

### 📚 Courses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/courses` | ❌ | List all courses |
| `GET` | `/courses/:id` | ❌ | Get single course |
| `POST` | `/courses` | ❌ | Create course manually |
| `PUT` | `/courses/:id` | ❌ | Update course |
| `DELETE` | `/courses/:id` | ❌ | Delete course |
| `GET` | `/courses/:id/pdf` | ❌ | Download course as PDF |
| `POST` | `/courses/:id/translate` | ❌ | Translate course to target language |

### 🗂️ Modules

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/modules/course/:courseId` | ❌ | Get modules for a course |
| `GET` | `/modules/:id` | ❌ | Get single module |
| `POST` | `/modules` | ❌ | Create module |
| `PUT` | `/modules/:id` | ❌ | Update module |
| `DELETE` | `/modules/:id` | ❌ | Delete module |

### 📖 Lessons

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/lessons/module/:moduleId` | ❌ | Get lessons for a module |
| `GET` | `/lessons/:id` | ❌ | Get single lesson |
| `POST` | `/lessons` | ❌ | Create lesson |
| `PUT` | `/lessons/:id` | ❌ | Update lesson |
| `DELETE` | `/lessons/:id` | ❌ | Delete lesson |

### 📋 Enrollments (🔒 Auth Required)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/enrollments` | ✅ | Enroll in a course |
| `GET` | `/enrollments/my` | ✅ | Get user's enrollments |
| `DELETE` | `/enrollments/:courseId` | ✅ | Unenroll from course |

### 📊 Progress (🔒 Auth Required)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/progress/:courseId` | ✅ | Get progress for course |
| `POST` | `/progress/:courseId/complete` | ✅ | Mark lesson as complete |

### 🛠️ Utilities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ | Server health check |
| `GET` | `/youtube/search?q=` | ❌ | Search YouTube for videos |

> 📖 Full API docs with request/response examples: [docs/API.md](./docs/API.md)

---

## ☁️ Deployment

| Layer | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | [text-to-learn-nu.vercel.app](https://text-to-learn-nu.vercel.app) |
| **Backend** | Render | [text-to-learn-dzhm.onrender.com](https://text-to-learn-dzhm.onrender.com) |
| **Database** | MongoDB Atlas | Cloud-hosted, auto-scaled |

### Frontend — Vercel
1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set **Root Directory** to `client`
4. Add environment variable: `VITE_API_URL=https://text-to-learn-dzhm.onrender.com/api/v1`
5. Deploy

### Backend — Render
1. Create new Web Service at [render.com](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory** to `server`
4. Set **Build Command** to `npm install` and **Start Command** to `node server.js`
5. Add all environment variables from `server/.env.example`
6. Select **Free** instance type and deploy

> 📖 Full deployment guide: [docs/Deployment.md](./docs/Deployment.md)

---

## 🗺️ Roadmap

| Status | Feature |
|---|---|
| ✅ | AI Course Generation via OpenRouter |
| ✅ | JWT Authentication (register, login, protected routes) |
| ✅ | PDF Course Export |
| ✅ | YouTube Video Recommendations per Lesson |
| ✅ | Course Enrollment and Progress Tracking |
| ✅ | AI Translation Service |
| 🔜 | OAuth 2.0 / Google Login |
| 🔜 | Quizzes and Assessments per Lesson |
| 🔜 | Course Sharing via Public Links |
| 🔜 | Markdown Export |
| 🔜 | Dark / Light Theme Toggle |
| 🔜 | Admin Dashboard |
| 🔜 | Course Ratings and Reviews |
| 🔜 | Email Notifications |
| 🔜 | Multi-language UI |

> 📖 Full roadmap details: [ROADMAP.md](./ROADMAP.md)

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here is how to get started:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide including code style, commit conventions, and review process.

---

## ⚠️ Known Limitations

| Limitation | Notes |
|---|---|
| **AI Response Variability** | LLMs can occasionally return malformed JSON; the server validates and has fallback handling, but a retry may be needed |
| **OpenRouter Rate Limits** | Free-tier models have per-minute request limits |
| **YouTube API Quota** | YouTube Data API v3 has a daily quota of 10,000 units |
| **No Real-Time Updates** | Course generation is synchronous; no streaming or progress bar |
| **Single AI Model** | Currently configured to one OpenRouter model; model selection is planned |
| **No Image Upload** | User profile pictures are stored as URL strings only |

---

## 💡 Why This Project

Text-to-Learn was built to solve a real problem: **structuring knowledge for learning takes time**. Whether you are a student exploring a new field or a professional upskilling quickly, organizing learning material is a bottleneck.

By combining Large Language Models with a structured curriculum format and YouTube video integration, Text-to-Learn compresses hours of research and planning into seconds.

The project demonstrates:

- **Full-stack production architecture** with clean separation of concerns (Controller → Service → Model)
- **AI integration patterns** — prompt engineering, response cleaning, JSON validation, fallback handling
- **Security best practices** — JWT, bcrypt, rate limiting, Helmet, input validation
- **REST API design** — proper middleware chains, async error handling, standardized responses
- **Cloud deployment** — three separate services communicating across Vercel, Render, and MongoDB Atlas

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Swajeet**

[![GitHub](https://img.shields.io/badge/GitHub-Swajeeet-181717?style=for-the-badge&logo=github)](https://github.com/Swajeeet)

---

<div align="center">

⭐ **If this project helped you, please consider giving it a star!** ⭐

*Built with ❤️ using React, Express, MongoDB, and AI*

</div>