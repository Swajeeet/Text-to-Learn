# YouTube Recommendations — Text-to-Learn

This document describes the YouTube video recommendation feature.

---

## Overview

Text-to-Learn fetches relevant educational YouTube videos for each lesson using the **YouTube Data API v3**. Videos are displayed to the user in the `LessonViewer` page, providing supplementary learning material alongside the AI-generated lesson content.

---

## Endpoint

```
GET /api/v1/youtube/search?q=<query>
```

- **Auth Required:** No
- **Query parameter:** `q` — search query string (required)

**Example:**
```
GET /api/v1/youtube/search?q=Python+variables+for+beginners
```

---

## Implementation

**File:** `server/services/youtubeService.js`  
**Function:** `searchVideos(query)`

### Flow

```
Client (LessonViewer)
      │
      │  GET /youtube/search?q=lesson+title
      ▼
Server (youtubeService.searchVideos)
      │
      │  GET https://www.googleapis.com/youtube/v3/search
      │  ?q=...&type=video&part=snippet&maxResults=5
      │  &key=YOUTUBE_API_KEY
      ▼
YouTube Data API v3
      │
      │  Returns search result list
      ▼
Server normalizes response:
  [{videoId, title, thumbnail, channelTitle}]
      │
      ▼
Client renders iframe embeds
```

---

## Response Format

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

---

## Client-Side Usage

The `LessonViewer` page constructs the search query from the lesson title and course topic, then fetches and renders YouTube videos:

**File:** `client/src/api/youtubeApi.js`

```javascript
// Search YouTube for videos related to a lesson
searchYouTubeVideos(query)
  → GET /api/v1/youtube/search?q=<query>
```

**Embedding:**
```html
<iframe
  src="https://www.youtube.com/embed/{videoId}"
  allowfullscreen
/>
```

---

## YouTube API Quota

| Operation | Quota Units |
|---|---|
| search.list | 100 units per request |
| Daily free quota | 10,000 units |
| Effective searches/day | ~100 searches |

> **Tip:** To increase quota, apply for a quota increase in Google Cloud Console or purchase additional quota.

---

## Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **YouTube Data API v3**
3. Create an **API Key** under Credentials
4. (Recommended) Restrict the key to **YouTube Data API v3** only
5. Add to `server/.env`:
   ```env
   YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

---

## Error Handling

| Error | Response |
|---|---|
| Missing `q` parameter | 400 — "Query parameter 'q' is required" |
| YouTube API key invalid | 500 — Server error |
| YouTube quota exceeded | 500 — Server error (consider caching results) |
