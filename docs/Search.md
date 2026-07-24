# Course Search — Text-to-Learn

This document describes the course search feature.

---

## Overview

Text-to-Learn provides a title-based course search that allows users to find courses by keyword. The search is case-insensitive and uses MongoDB's regex operator for flexible matching.

---

## Endpoint

```
GET /api/v1/courses?search=<query>
```

- **Auth Required:** No
- **Query parameter:** `search` — search keyword (optional; omit to get all courses)

**Examples:**
```
GET /api/v1/courses                    → all courses
GET /api/v1/courses?search=python      → courses with "python" in title
GET /api/v1/courses?search=machine+learning
```

---

## Implementation

**File:** `server/controllers/courseController.js` → `server/services/courseService.js`

### MongoDB Query

```javascript
const query = searchQuery
  ? { title: { $regex: searchQuery, $options: 'i' } }
  : {};

const courses = await Course.find(query).sort({ createdAt: -1 });
```

- `$regex` — regular expression pattern matching
- `$options: 'i'` — case-insensitive matching
- `.sort({ createdAt: -1 })` — newest courses first

---

## Response

```json
{
  "statusCode": 200,
  "data": {
    "courses": [
      {
        "_id": "64b1c2d3e4f5678901234",
        "title": "Python for Beginners",
        "description": "Learn Python from the ground up.",
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

## Client-Side Usage

The `MyCourses` and `Home` pages use the search API:

**File:** `client/src/api/courseApi.js`

```javascript
getAllCourses(searchQuery)
  → GET /api/v1/courses?search=<searchQuery>
```

The frontend typically debounces the search input to avoid excessive API calls while the user types.

---

## Performance Note

For large datasets, add a text index to the `title` field in MongoDB:

```javascript
courseSchema.index({ title: 'text' });
```

This enables full-text search with `$text` queries, which is faster than `$regex` at scale. For the current scope (portfolio/demo), regex is sufficient.
