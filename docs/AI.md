# AI Integration — Text-to-Learn

This document covers the AI integration in Text-to-Learn — including the OpenRouter API, prompt engineering, response pipeline, and error handling.

---

## Overview

Text-to-Learn uses **OpenRouter** as its AI gateway to access Large Language Models (LLMs). OpenRouter provides an OpenAI-compatible API, so the backend uses the `openai` npm SDK configured to point to OpenRouter's base URL.

The AI is used for two features:
1. **Course Generation** — primary feature, generates complete structured courses
2. **Course Translation** — translates course content to a target language

---

## OpenRouter Configuration

**File:** `server/config/openrouter.js`

```
OPENROUTER_API_KEY (env var)
        │
        ▼
getOpenRouterClient()  →  OpenAI SDK instance
        │                 baseURL: https://openrouter.ai/api/v1
        │                 apiKey: OPENROUTER_API_KEY
        ▼
Used in geminiService.js and translationService.js
```

The client is created lazily (on first call) to ensure environment variables are loaded before initialization.

---

## Default AI Model

**File:** `server/constants/aiConstants.js`

```javascript
DEFAULT_MODEL = "deepseek/deepseek-r1-0528"
```

This model is used for all course generation requests. It can be changed by modifying `aiConstants.js` or adding an environment variable for model selection (planned future feature).

---

## Course Generation Pipeline

### Step 1 — Prompt Building

**File:** `server/utils/ai/promptBuilder.js`  
**Function:** `buildCoursePrompt(topic)`

The prompt instructs the LLM to:
- Act as an expert curriculum designer
- Return **only** valid JSON (no markdown, no code fences)
- Generate exactly **5 modules**, each with exactly **5 lessons**
- Each lesson must have: `title`, `summary`, `content`, `duration`
- Difficulty must be: `Beginner`, `Intermediate`, or `Advanced`
- `estimatedDuration` is in hours (integer)

**Output JSON Schema:**
```json
{
  "title": "string",
  "description": "string",
  "difficulty": "Beginner | Intermediate | Advanced",
  "estimatedDuration": 0,
  "modules": [
    {
      "title": "string",
      "description": "string",
      "lessons": [
        {
          "title": "string (5-8 words)",
          "summary": "string (one sentence)",
          "content": "string (2-3 sentences)",
          "duration": 0
        }
      ]
    }
  ]
}
```

### Step 2 — API Call

**File:** `server/services/geminiService.js`  
**Function:** `generateCourseOutline(topic)`

```javascript
const completion = await client.chat.completions.create({
  model: DEFAULT_MODEL,
  messages: [{ role: "user", content: prompt }]
});
```

OpenRouter returns a standard OpenAI-compatible response object.

### Step 3 — Response Cleaning

**File:** `server/utils/ai/responseCleaner.js`  
**Function:** `cleanResponse(text)`

LLMs sometimes wrap JSON responses in markdown code fences despite instructions:

```
```json
{ ... }
```
```

The cleaner strips these fences using regex patterns to extract the raw JSON string.

### Step 4 — JSON Parsing

```javascript
courseJSON = JSON.parse(cleanedResponse);
```

If parsing fails (truncated response, invalid JSON), the error is caught and a descriptive message is returned to the client with instructions to retry.

### Step 5 — JSON Validation

**File:** `server/utils/ai/jsonValidator.js`  
**Function:** `validateCourseJSON(obj)`

Validates that the parsed object has:
- `title` (string)
- `description` (string)
- `modules` (array, non-empty)
- Each module has `lessons` (array)

Throws `ApiError(400)` if validation fails.

### Step 6 — Database Persistence

**File:** `server/controllers/aiController.js`

```javascript
// 1. Save course
const savedCourse = await courseService.createGeneratedCourse(generatedCourse);

// 2. Save modules
const savedModules = await moduleService.createGeneratedModules(savedCourse._id, generatedCourse.modules);

// 3. Save lessons (parallel)
const savedLessonsNested = await Promise.all(
  savedModules.map((savedModule, index) => {
    const aiModule = generatedCourse.modules[index];
    const lessons = aiModule?.lessons?.length > 0
      ? aiModule.lessons
      : buildFallbackLessons(savedModule.title);  // Graceful fallback
    return lessonService.createGeneratedLessons(savedModule._id, lessons);
  })
);
```

---

## Fallback Lesson System

If the AI omits lessons for a module (due to model truncation or response errors), the system generates fallback lessons:

```javascript
const DEFAULT_LESSON_TITLES = [
  "Introduction",
  "Core Concepts",
  "Hands-on Examples",
  "Common Mistakes",
  "Summary & Next Steps"
];
```

Each fallback lesson gets a generic but meaningful title, summary, and content referencing the module topic. This ensures every course always has complete content.

---

## Error Handling

| Error Scenario | Handling |
|---|---|
| OpenRouter returns error body (e.g., 402, 429) | Detected via `completion.error` check; throws with error code and message |
| No choices in response | Throws: "OpenRouter returned an empty response" |
| JSON parse failure | Logs raw response (first 500 chars); throws descriptive retry message |
| JSON validation failure | Throws ApiError(400) with validation details |
| API network error | Propagates to global error middleware → 500 response |

---

## Course Translation

**File:** `server/services/translationService.js`  
**Function:** `translateCourse(course, modules, targetLanguage)`

Uses the same OpenRouter client to translate course content:

1. Sends course title, description, and module titles/descriptions to the LLM
2. Instructs the LLM to translate to `targetLanguage`
3. Returns translated course and module objects

**API Endpoint:** `POST /api/v1/courses/:id/translate`  
**Request body:** `{ "targetLanguage": "Spanish" }`

---

## Prompt Engineering Best Practices Used

| Technique | Implementation |
|---|---|
| **Role priming** | "You are an expert curriculum designer" |
| **Format enforcement** | "Return ONLY JSON. Do NOT use markdown." |
| **Structural constraints** | "Exactly 5 modules. Exactly 5 lessons per module." |
| **Field specification** | Explicit field names, types, and constraints |
| **Output template** | Full JSON skeleton provided in prompt |
| **Defense against fences** | `responseCleaner.js` strips markdown even if LLM disobeys |

---

## Adding a New AI Feature

To add a new AI-powered feature:

1. **Create a service** in `server/services/` (e.g., `quizService.js`)
2. **Build a prompt** in `server/utils/ai/` using `buildCoursePrompt` as a template
3. **Call** `getOpenRouterClient()` to get the API client
4. **Add cleaning/validation** if the response needs parsing
5. **Create a controller** in `server/controllers/`
6. **Register a route** in `server/routes/` and mount in `app.js`

---

*For deployment configuration see [Deployment.md](./Deployment.md) · For API details see [API.md](./API.md)*
