# API Documentation — Text-to-Learn

**Base URL (Production):** `https://text-to-learn-production.up.railway.app/api/v1`

**Base URL (Local):** `http://localhost:5000/api/v1`

---

## Overview

All API responses follow a standardized envelope format:

### Success Response
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful",
  "success": true
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Authentication

Protected endpoints require a JWT Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained via the login or register endpoints.

---

## 🛠️ Utilities

### Health Check

**`GET /health`**

Verifies the server is running.

- **Auth Required:** No

**Response:**
```json
{
  "success": true,
  "status": "Server Running",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## 🔐 Authentication

### Register

**`POST /auth/register`**

Creates a new user account and returns a JWT token.

- **Auth Required:** No
- **Rate Limit:** 20 requests per 15 minutes

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Validation Rules:**
- `name`: Required, string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "picture": "",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Account created successfully",
  "success": true
}
```

**Error Responses:**
- `400` — Validation failed (missing or invalid fields)
- `409` — Email already registered

---

### Login

**`POST /auth/login`**

Authenticates an existing user and returns a JWT token.

- **Auth Required:** No
- **Rate Limit:** 20 requests per 15 minutes

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "picture": ""
    }
  },
  "message": "Login successful",
  "success": true
}
```

**Error Responses:**
- `400` — Validation failed
- `401` — Invalid email or password

---

### Get Profile

**`GET /auth/profile`**

Returns the currently authenticated user's profile.

- **Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "picture": ""
    }
  },
  "message": "Profile fetched successfully",
  "success": true
}
```

**Error Responses:**
- `401` — No token or invalid token

---

### Update Profile

**`PUT /auth/profile`**

Updates the authenticated user's name, email, or picture.

- **Auth Required:** ✅ Yes

**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "picture": "https://example.com/avatar.jpg"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Updated",
      "email": "john.updated@example.com",
      "picture": "https://example.com/avatar.jpg"
    }
  },
  "message": "Profile updated successfully",
  "success": true
}
```

---

## 🤖 AI Generation

### Generate Course

**`POST /ai/generate-course`**

Generates a complete structured course from a topic string using an LLM via OpenRouter. Creates the course, all modules, and all lessons in MongoDB in a single request.

- **Auth Required:** No

**Request Body:**
```json
{
  "topic": "Introduction to Machine Learning"
}
```

**Processing Pipeline:**
1. Build structured prompt from topic
2. Call OpenRouter API (LLM)
3. Clean AI response (strip markdown fences)
4. Parse and validate JSON structure
5. Save course → modules → lessons to MongoDB

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "course": {
      "_id": "64b1c2d3e4f5678901234",
      "title": "Introduction to Machine Learning",
      "description": "A comprehensive beginner course covering...",
      "difficulty": "Beginner",
      "estimatedDuration": 10,
      "status": "Draft",
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "modules": [
      {
        "_id": "64c1d2e3f4a5678901235",
        "title": "Foundations of ML",
        "description": "Understand the core concepts...",
        "courseId": "64b1c2d3e4f5678901234"
      }
    ],
    "lessons": [
      {
        "_id": "64d1e2f3a4b5678901236",
        "title": "What is Machine Learning?",
        "summary": "An introduction to the definition and scope of ML.",
        "content": "Machine learning is a subset of artificial intelligence...",
        "duration": 10,
        "moduleId": "64c1d2e3f4a5678901235"
      }
    ]
  },
  "message": "AI Course Generated Successfully",
  "success": true
}
```

**Error Responses:**
- `400` — Topic is required
- `500` — OpenRouter API error or JSON parse failure (retry recommended)
- `503` — OpenRouter rate limit exceeded

---

## 📚 Courses

### Get All Courses

**`GET /courses`**

Returns all courses. Supports optional search by title.

- **Auth Required:** No

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `search` | string | No | Filter courses by title (case-insensitive) |

**Example:**
```
GET /courses?search=python
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "courses": [
      {
        "_id": "64b1c2d3e4f5678901234",
        "title": "Python for Beginners",
        "description": "Learn Python from scratch...",
        "difficulty": "Beginner",
        "estimatedDuration": 8,
        "status": "Draft",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  },
  "message": "Courses fetched successfully",
  "success": true
}
```

---

### Get Single Course

**`GET /courses/:id`**

Returns a single course by its MongoDB ID.

- **Auth Required:** No

**Path Parameters:**
- `id` — MongoDB ObjectId of the course

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "course": {
      "_id": "64b1c2d3e4f5678901234",
      "title": "Python for Beginners",
      "description": "Learn Python from scratch...",
      "difficulty": "Beginner",
      "estimatedDuration": 8,
      "status": "Draft"
    }
  },
  "message": "Course fetched successfully",
  "success": true
}
```

**Error Responses:**
- `404` — Course not found

---

### Create Course (Manual)

**`POST /courses`**

Manually creates a course (not AI-generated).

- **Auth Required:** No

**Request Body:**
```json
{
  "title": "My Custom Course",
  "description": "A course I designed manually.",
  "difficulty": "Intermediate",
  "estimatedDuration": 5
}
```

**Validation Rules:**
- `title`: Required, string
- `description`: Required, string
- `difficulty`: Must be `"Beginner"`, `"Intermediate"`, or `"Advanced"`

---

### Update Course

**`PUT /courses/:id`**

Updates an existing course's fields.

- **Auth Required:** No

**Request Body (partial update supported):**
```json
{
  "title": "Updated Title",
  "status": "Published"
}
```

---

### Delete Course

**`DELETE /courses/:id`**

Permanently deletes a course.

- **Auth Required:** No

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Course deleted successfully",
  "success": true
}
```

---

### Download Course as PDF

**`GET /courses/:id/pdf`**

Generates and streams a PDF file containing the full course content.

- **Auth Required:** No

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="course_title.pdf"`
- Body: Binary PDF buffer

**PDF Contents:**
- Cover page with course title and metadata
- All modules with their descriptions
- All lessons with titles, summaries, and content

---

### Translate Course

**`POST /courses/:id/translate`**

Uses AI to translate the course content to a target language.

- **Auth Required:** No

**Request Body:**
```json
{
  "targetLanguage": "Spanish"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "course": { "...translated course object..." },
    "modules": [ "...translated module objects..." ]
  },
  "message": "Course translated to Spanish",
  "success": true
}
```

---

## 🗂️ Modules

### Get Modules for Course

**`GET /modules/course/:courseId`**

Returns all modules belonging to a specific course.

- **Auth Required:** No

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "modules": [
      {
        "_id": "64c1d2e3f4a5678901235",
        "title": "Module 1: Foundations",
        "description": "Core concepts and fundamentals.",
        "courseId": "64b1c2d3e4f5678901234"
      }
    ],
    "count": 5
  },
  "message": "Modules fetched successfully",
  "success": true
}
```

---

### Get Single Module

**`GET /modules/:id`**

Returns a single module by its ID.

- **Auth Required:** No

---

### Create Module

**`POST /modules`**

Creates a module manually.

- **Auth Required:** No

**Request Body:**
```json
{
  "title": "Module Title",
  "description": "Module description.",
  "courseId": "64b1c2d3e4f5678901234"
}
```

---

### Update Module

**`PUT /modules/:id`**

Updates an existing module.

- **Auth Required:** No

---

### Delete Module

**`DELETE /modules/:id`**

Deletes a module and its associated lessons.

- **Auth Required:** No

---

## 📖 Lessons

### Get Lessons for Module

**`GET /lessons/module/:moduleId`**

Returns all lessons within a specific module.

- **Auth Required:** No

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "lessons": [
      {
        "_id": "64d1e2f3a4b5678901236",
        "title": "What is Python?",
        "summary": "An overview of the Python language.",
        "content": "Python is a high-level, interpreted programming language...",
        "duration": 10,
        "moduleId": "64c1d2e3f4a5678901235"
      }
    ],
    "count": 5
  },
  "message": "Lessons fetched successfully",
  "success": true
}
```

---

### Get Single Lesson

**`GET /lessons/:id`**

Returns a single lesson by its ID.

- **Auth Required:** No

---

### Create Lesson

**`POST /lessons`**

Creates a lesson manually.

- **Auth Required:** No

**Request Body:**
```json
{
  "title": "Lesson Title",
  "summary": "One sentence summary.",
  "content": "Full lesson content here.",
  "duration": 10,
  "moduleId": "64c1d2e3f4a5678901235"
}
```

**Validation Rules:**
- `title`: Required
- `moduleId`: Required, valid ObjectId

---

### Update Lesson

**`PUT /lessons/:id`**

Updates an existing lesson.

- **Auth Required:** No

---

### Delete Lesson

**`DELETE /lessons/:id`**

Permanently deletes a lesson.

- **Auth Required:** No

---

## 📋 Enrollments

> All enrollment endpoints require authentication.

### Enroll in Course

**`POST /enrollments`**

Enrolls the authenticated user in a course.

- **Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "courseId": "64b1c2d3e4f5678901234"
}
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "enrollment": {
      "_id": "64e1f2a3b4c5678901237",
      "userId": "64a1b2c3d4e5f6789012345",
      "courseId": "64b1c2d3e4f5678901234",
      "enrolledAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Enrolled successfully",
  "success": true
}
```

---

### Get My Enrollments

**`GET /enrollments/my`**

Returns all courses the authenticated user is enrolled in.

- **Auth Required:** ✅ Yes

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "enrollments": [
      {
        "_id": "64e1f2a3b4c5678901237",
        "courseId": {
          "_id": "64b1c2d3e4f5678901234",
          "title": "Python for Beginners",
          "difficulty": "Beginner"
        },
        "enrolledAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "count": 1
  },
  "message": "Enrollments fetched",
  "success": true
}
```

---

### Unenroll from Course

**`DELETE /enrollments/:courseId`**

Removes the authenticated user's enrollment from a course.

- **Auth Required:** ✅ Yes

---

## 📊 Progress

> All progress endpoints require authentication.

### Get Course Progress

**`GET /progress/:courseId`**

Returns the progress record for the authenticated user for a specific course.

- **Auth Required:** ✅ Yes

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "progress": {
      "_id": "64f1a2b3c4d5678901238",
      "userId": "64a1b2c3d4e5f6789012345",
      "courseId": "64b1c2d3e4f5678901234",
      "completedLessons": [
        "64d1e2f3a4b5678901236",
        "64d1e2f3a4b5678901237"
      ],
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Progress fetched",
  "success": true
}
```

---

### Mark Lesson Complete

**`POST /progress/:courseId/complete`**

Marks a specific lesson as completed for the authenticated user.

- **Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "lessonId": "64d1e2f3a4b5678901236"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "progress": {
      "completedLessons": ["64d1e2f3a4b5678901236"],
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  },
  "message": "Lesson marked complete",
  "success": true
}
```

---

## 🎬 YouTube Search

### Search Videos

**`GET /youtube/search?q=<query>`**

Searches YouTube Data API v3 for educational videos matching the query.

- **Auth Required:** No

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `q` | string | ✅ Yes | Search query string |

**Example:**
```
GET /youtube/search?q=Python+for+beginners+tutorial
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "videos": [
      {
        "videoId": "rfscVS0vtbw",
        "title": "Learn Python - Full Course for Beginners",
        "thumbnail": "https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg",
        "channelTitle": "freeCodeCamp.org"
      }
    ],
    "count": 5
  },
  "message": "Videos fetched",
  "success": true
}
```

**Error Responses:**
- `400` — Query parameter `q` is required
- `500` — YouTube API quota exceeded or key invalid

---

## Error Codes Reference

| Status Code | Meaning |
|---|---|
| `200` | OK — Request successful |
| `201` | Created — Resource created successfully |
| `400` | Bad Request — Validation failed or missing fields |
| `401` | Unauthorized — Missing or invalid JWT token |
| `403` | Forbidden — Authenticated but lacks permission |
| `404` | Not Found — Resource does not exist |
| `409` | Conflict — Duplicate resource (e.g., email already registered) |
| `429` | Too Many Requests — Rate limit exceeded |
| `500` | Internal Server Error — Server-side failure |
| `503` | Service Unavailable — External API unavailable |
