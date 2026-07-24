# Architecture — Text-to-Learn

This document describes the technical architecture of the Text-to-Learn platform.

---

## Overview

Text-to-Learn follows a classic **three-tier architecture**:

1. **Presentation Layer** — React + Vite SPA hosted on Vercel
2. **Application Layer** — Express.js REST API hosted on Railway
3. **Data Layer** — MongoDB Atlas (cloud-hosted NoSQL database)

External services (OpenRouter AI, YouTube Data API) are consumed exclusively by the backend.

---

## System Architecture Diagram

```mermaid
graph TD
    User["👤 User (Browser)"]

    subgraph Vercel["☁️ Vercel (Frontend)"]
        React["React 19 + Vite\nSPA"]
    end

    subgraph Railway["🚂 Railway (Backend)"]
        Express["Express.js 5\nREST API\n/api/v1"]
    end

    subgraph Atlas["🍃 MongoDB Atlas"]
        DB[("MongoDB\nCollections")]
    end

    subgraph ExternalAPIs["🌐 External APIs"]
        OpenRouter["OpenRouter API\n(LLM)"]
        YouTube["YouTube\nData API v3"]
    end

    User -->|HTTPS| React
    React -->|HTTPS REST| Express
    Express -->|Mongoose ODM| DB
    Express -->|HTTP POST| OpenRouter
    Express -->|HTTP GET| YouTube
```

---

## Frontend Architecture

```mermaid
graph TD
    main["main.jsx\nReact DOM Root"]
    main --> App["App.jsx\nAuthProvider wrapper"]
    App --> AppRoutes["AppRoutes.jsx\nReact Router v7"]

    AppRoutes --> PublicRoute["PublicRoute\nRedirects if authed"]
    AppRoutes --> PrivateRoute["PrivateRoute\nBlocks if not authed"]
    AppRoutes --> MainLayout["MainLayout\nNavbar + Outlet"]

    MainLayout --> Pages["Pages\nHome · Login · Register\nDashboard · GenerateCourse\nCourseDetails · LessonViewer\nMyCourses · Profile · NotFound"]

    Pages --> APILayer["API Layer (src/api/)\nAxios instance + modules"]
    APILayer -->|Bearer token| Backend["Backend /api/v1"]

    AuthContext["AuthContext\nuser, token, login, logout"] --> useAuth["useAuth() hook"]
    useAuth --> Pages
```

### Key Frontend Patterns

| Pattern | Implementation |
|---|---|
| **Auth State** | React Context + localStorage persistence |
| **Route Protection** | `PrivateRoute` / `PublicRoute` wrappers |
| **API Calls** | Centralized Axios instance with auth interceptor |
| **Notifications** | `react-hot-toast` for success/error feedback |
| **Layout** | `MainLayout` wraps all authenticated pages with `Navbar` |

---

## Backend Architecture

```mermaid
graph LR
    Request["HTTP Request"]

    subgraph Middleware["Middleware Chain"]
        Helmet["helmet()"]
        CORS["cors()"]
        RateLimit["express-rate-limit"]
        Morgan["morgan()"]
        JSON["express.json()"]
        AuthMW["authMiddleware\nprotect()"]
        Validate["validationMiddleware"]
    end

    subgraph Routes["Routes /api/v1"]
        AuthR["/auth"]
        AIR["/ai"]
        CourseR["/courses"]
        ModuleR["/modules"]
        LessonR["/lessons"]
        EnrollR["/enrollments"]
        ProgressR["/progress"]
    end

    subgraph Controllers["Controllers"]
        AuthC["authController"]
        AIC["aiController"]
        CourseC["courseController"]
    end

    subgraph Services["Services"]
        UserS["userService"]
        GeminiS["geminiService"]
        CourseS["courseService"]
        PDFS["pdfService"]
        YTS["youtubeService"]
    end

    subgraph Models["Mongoose Models"]
        UserM["User"]
        CourseM["Course"]
        ModuleM["Module"]
        LessonM["Lesson"]
        EnrollM["Enrollment"]
        ProgressM["Progress"]
    end

    Request --> Middleware
    Middleware --> Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> Models
    Models --> Atlas[("MongoDB Atlas")]
```

### Layered Architecture

```
HTTP Request
    ↓
Route Handler (routes/*.js)
    ↓
Input Validation (validators/ + validationMiddleware)
    ↓
Auth Check (authMiddleware.protect — if protected route)
    ↓
Controller (controllers/*.js)
    ↓
Service (services/*.js — business logic)
    ↓
Model (models/*.js — Mongoose ODM)
    ↓
MongoDB Atlas
    ↓
ApiResponse → HTTP Response
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client as React Client
    participant Server as Express Server
    participant DB as MongoDB Atlas

    Client->>Server: POST /api/v1/auth/register {name, email, password}
    Server->>Server: Validate with express-validator
    Server->>DB: Check if email exists
    DB-->>Server: Not found
    Server->>Server: bcrypt.hash(password, 12)
    Server->>DB: User.create({name, email, hashedPassword})
    DB-->>Server: Saved user doc
    Server->>Server: jwt.sign({userId}, JWT_SECRET, {expiresIn})
    Server-->>Client: 201 {token, user}
    Client->>Client: Store token in localStorage

    Note over Client,Server: Subsequent authenticated requests

    Client->>Server: GET /api/v1/auth/profile\n[Authorization: Bearer token]
    Server->>Server: authMiddleware: jwt.verify(token)
    Server->>DB: User.findById(decoded.userId)
    DB-->>Server: User doc
    Server-->>Client: 200 {user}
```

---

## Course Generation Flow

```mermaid
sequenceDiagram
    participant Client as React Client
    participant Controller as aiController
    participant Prompt as promptBuilder
    participant OR as OpenRouter API
    participant Cleaner as responseCleaner
    participant Validator as jsonValidator
    participant DB as MongoDB Atlas

    Client->>Controller: POST /api/v1/ai/generate-course {topic}
    Controller->>Prompt: buildCoursePrompt(topic)
    Prompt-->>Controller: Structured prompt string

    Controller->>OR: chat.completions.create({model, messages})
    OR-->>Controller: Raw text response (may contain markdown fences)

    Controller->>Cleaner: cleanResponse(rawText)
    Cleaner-->>Controller: Clean JSON string

    Controller->>Controller: JSON.parse(cleanedString)

    Controller->>Validator: validateCourseJSON(courseJSON)
    Validator-->>Controller: Valid ✓ (or throws ApiError)

    Controller->>DB: courseService.createGeneratedCourse(courseJSON)
    Controller->>DB: moduleService.createGeneratedModules(courseId, modules)
    Controller->>DB: lessonService.createGeneratedLessons(moduleId, lessons) × N

    DB-->>Controller: Saved documents
    Controller-->>Client: 201 {course, modules, lessons}
```

---

## PDF Generation Flow

```mermaid
flowchart TD
    A["GET /api/v1/courses/:id/pdf"] --> B["courseService.getCourseById(id)"]
    B --> C["moduleService.getModulesByCourse(id)"]
    C --> D["lessonService.getLessonsByModule(moduleId) × N\n(Promise.all — parallel)"]
    D --> E["pdfService.generateCoursePDF(course, modules, lessonsMap)"]
    E --> F["PDFKit: build PDF buffer\n• Cover page\n• Course metadata\n• Modules + Lessons"]
    F --> G["res.set Content-Type: application/pdf\nContent-Disposition: attachment"]
    G --> H["res.send(pdfBuffer)"]
```

---

## YouTube Recommendation Flow

```mermaid
sequenceDiagram
    participant Client as LessonViewer
    participant Server as Express Server
    participant YT as YouTube Data API v3

    Client->>Server: GET /api/v1/youtube/search?q=lesson+title+topic
    Server->>Server: Validate q param
    Server->>YT: GET /youtube/v3/search?q=...&type=video&part=snippet
    YT-->>Server: Video list (id, title, thumbnail, channelTitle)
    Server-->>Client: 200 {videos: [...], count: N}
    Client->>Client: Render YouTube iframe embeds
```

---

## Search Flow

```mermaid
flowchart TD
    A["GET /api/v1/courses?search=query"] --> B["courseController.getAllCourses"]
    B --> C{"Has search param?"}
    C -->|Yes| D["Course.find({title: {$regex: query, $options: 'i'}})"]
    C -->|No| E["Course.find({})"]
    D --> F["Sort by createdAt desc"]
    E --> F
    F --> G["200 {courses, count}"]
```

---

## Data Models

```mermaid
erDiagram
    USER {
        ObjectId _id
        String name
        String email
        String password
        String picture
        String role
        Date createdAt
    }

    COURSE {
        ObjectId _id
        String title
        String description
        String difficulty
        Number estimatedDuration
        String language
        String status
        ObjectId createdBy
        Date createdAt
    }

    MODULE {
        ObjectId _id
        String title
        String description
        ObjectId courseId
        Date createdAt
    }

    LESSON {
        ObjectId _id
        String title
        String summary
        String content
        Number duration
        ObjectId moduleId
        Date createdAt
    }

    ENROLLMENT {
        ObjectId _id
        ObjectId userId
        ObjectId courseId
        Date enrolledAt
    }

    PROGRESS {
        ObjectId _id
        ObjectId userId
        ObjectId courseId
        Array completedLessons
        Date updatedAt
    }

    USER ||--o{ COURSE : "creates"
    USER ||--o{ ENROLLMENT : "has"
    USER ||--o{ PROGRESS : "tracks"
    COURSE ||--o{ MODULE : "contains"
    COURSE ||--o{ ENROLLMENT : "has"
    COURSE ||--o{ PROGRESS : "tracked by"
    MODULE ||--o{ LESSON : "contains"
```

---

## Security Architecture

```mermaid
flowchart TD
    Request["Incoming Request"] --> Helmet["🪖 Helmet\nSecurity Headers"]
    Helmet --> CORS["🌐 CORS\nOrigin Control"]
    CORS --> RL["⏱️ Rate Limiter\nGlobal: 100/15min\nAuth: 20/15min"]
    RL --> Body["📦 Body Parser\nMax 10mb"]
    Body --> Routes["Router"]
    Routes --> Protected{"Protected\nRoute?"}
    Protected -->|Yes| JWT["🔑 JWT Verify\nauthMiddleware.protect()"]
    Protected -->|No| Validate["✅ Input Validation\nexpress-validator"]
    JWT --> Validate
    Validate --> Controller["Controller"]
    Controller --> ErrorH["🚨 Error Middleware\nAsyncHandler wrapper"]
```

---

*For API details see [API.md](./API.md) · For deployment see [Deployment.md](./Deployment.md)*
