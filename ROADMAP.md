# Roadmap — Text-to-Learn

This document outlines the planned features and improvements for Text-to-Learn, organized by milestone.

---

## Current State — v1.0.0

### ✅ Completed

| Feature | Status |
|---|---|
| AI Course Generation (OpenRouter) | ✅ Done |
| JWT Authentication (register, login, protected routes) | ✅ Done |
| Course Enrollment & Progress Tracking | ✅ Done |
| PDF Course Export | ✅ Done |
| YouTube Video Recommendations | ✅ Done |
| AI Course Translation | ✅ Done |
| Course Search | ✅ Done |
| User Profile (view & edit) | ✅ Done |
| MongoDB Atlas (6 collections) | ✅ Done |
| Deployed: Vercel + Railway + MongoDB Atlas | ✅ Done |
| Security: JWT, bcrypt, rate limiting, Helmet | ✅ Done |
| Comprehensive Documentation | ✅ Done |

---

## Milestone 1.1 — Core Enhancements

> Targeted improvements to the existing feature set.

| Feature | Priority | Description |
|---|---|---|
| **AI Model Selection** | 🔴 High | Allow users/admins to select from multiple OpenRouter models |
| **Streaming Course Generation** | 🔴 High | Stream AI response to client for real-time progress feedback |
| **Course Caching** | 🟡 Medium | Cache generated courses to reduce redundant AI API calls |
| **YouTube Results Caching** | 🟡 Medium | Cache YouTube search results per lesson to reduce API quota usage |
| **Improved Error Messages** | 🟡 Medium | More descriptive client-facing error messages for AI failures |
| **Input Sanitization** | 🟡 Medium | Sanitize course topic input before sending to AI |

---

## Milestone 1.2 — User Experience

> Features to enhance the learning experience.

| Feature | Priority | Description |
|---|---|---|
| **Quiz & Assessment System** | 🔴 High | AI-generated quizzes per lesson with scoring |
| **Course Progress Bar** | 🔴 High | Visual progress indicator per course |
| **Dark / Light Theme Toggle** | 🟡 Medium | User-selectable color scheme |
| **Course Ratings & Reviews** | 🟡 Medium | Star ratings and text reviews on courses |
| **Lesson Bookmarks** | 🟢 Low | Save specific lessons for quick access |
| **Reading Time Estimates** | 🟢 Low | Show estimated reading time per lesson based on content length |

---

## Milestone 1.3 — Social & Sharing

> Features for community and collaboration.

| Feature | Priority | Description |
|---|---|---|
| **Course Sharing via Public Link** | 🔴 High | Generate shareable URLs for courses |
| **Course Cloning** | 🟡 Medium | Let users copy a course to their own library for customization |
| **User-generated Comments** | 🟡 Medium | Comment threads on lessons |
| **Course Collections / Playlists** | 🟢 Low | Group related courses into a learning path |

---

## Milestone 2.0 — Platform Maturity

> Major features that transform the product.

| Feature | Priority | Description |
|---|---|---|
| **OAuth 2.0 / Google Login** | 🔴 High | Sign in with Google via OAuth 2.0 |
| **Admin Dashboard** | 🔴 High | Admin UI for managing users, courses, and system stats |
| **Email Notifications** | 🟡 Medium | Welcome emails, course completion certificates |
| **Markdown Export** | 🟡 Medium | Export courses as Markdown files |
| **Multi-language UI** | 🟡 Medium | Internationalize the frontend (i18n) |
| **Course Image Generation** | 🟢 Low | AI-generated course thumbnail images |
| **Certificates of Completion** | 🟢 Low | Downloadable PDF certificates |

---

## Long-term Vision

- **Mobile App** — React Native version of the platform
- **Learning Analytics** — Track time spent, completion rates, user engagement
- **Team/Organization Accounts** — Multi-user workspaces for teams
- **AI Tutor** — Conversational AI to answer questions about lesson content
- **Live Courses** — Real-time collaborative course sessions

---

## Contributing to the Roadmap

Have an idea for a feature? Open a [Feature Request](https://github.com/Swajeeet/Text-to-Learn/issues/new?template=feature_request.md) on GitHub Issues.

Want to work on something from this roadmap? Check [open issues](https://github.com/Swajeeet/Text-to-Learn/issues) and leave a comment expressing interest. Maintainers will assign the issue to you.

---

*Last updated: July 2025*
