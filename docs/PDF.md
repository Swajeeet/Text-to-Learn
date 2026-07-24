# PDF Export — Text-to-Learn

This document describes the PDF course export feature.

---

## Overview

Text-to-Learn allows users to download any course as a professionally formatted PDF. The PDF is generated server-side using **PDFKit** and streamed directly to the client as a binary buffer.

---

## Endpoint

```
GET /api/v1/courses/:id/pdf
```

- **Auth Required:** No
- **Response:** Binary PDF file stream
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="<course_title>.pdf"`

---

## Implementation

**File:** `server/services/pdfService.js`  
**Function:** `generateCoursePDF(course, modules, lessonsMap)`

### Data Collection

Before generating the PDF, the server collects all necessary data in parallel:

```
GET /courses/:id/pdf
      │
      ▼
courseService.getCourseById(id)
      │
      ▼
moduleService.getModulesByCourse(id)
      │
      ▼
lessonService.getLessonsByModule(moduleId) × N   [Promise.all — parallel]
      │
      ▼
pdfService.generateCoursePDF(course, modules, lessonsMap)
      │
      ▼
res.send(pdfBuffer)
```

### PDF Structure

```
┌─────────────────────────────────────┐
│           COVER PAGE                │
│                                     │
│  Course Title (large)               │
│  Description (paragraph)            │
│  Difficulty: [level]                │
│  Estimated Duration: [N] hours      │
│                                     │
├─────────────────────────────────────┤
│           MODULE 1                  │
│  Module Title                       │
│  Module Description                 │
│                                     │
│    Lesson 1.1 — Title               │
│    Summary: ...                     │
│    Content: ...                     │
│    Duration: N min                  │
│                                     │
│    Lesson 1.2 — Title               │
│    ...                              │
│                                     │
├─────────────────────────────────────┤
│           MODULE 2                  │
│  ...                                │
└─────────────────────────────────────┘
```

---

## File Naming

The PDF filename is derived from the course title:

```javascript
const safeTitle = course.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
// e.g., "Introduction to Python" → "introduction_to_python.pdf"
```

---

## Usage

### From the UI

On the `CourseDetails` page, click the **Download PDF** button. The browser will download the file automatically.

### Direct API Call

```bash
curl -O -J "https://text-to-learn-production.up.railway.app/api/v1/courses/COURSE_ID/pdf"
```

### JavaScript (Axios)

```javascript
const response = await axios.get(`/api/v1/courses/${courseId}/pdf`, {
  responseType: 'blob'
});

const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', 'course.pdf');
document.body.appendChild(link);
link.click();
```

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| **PDFKit** | 0.19.x | PDF generation library for Node.js |

PDFKit creates PDFs programmatically — no templates or HTML conversion required.

---

## Error Handling

| Error | Response |
|---|---|
| Course not found | 404 — "Course not found" |
| Module fetch failure | 500 — Server error |
| PDF generation failure | 500 — Server error |
