# Authentication — Text-to-Learn

This document describes the authentication system used in Text-to-Learn.

---

## Overview

Text-to-Learn uses **stateless JWT (JSON Web Token) authentication**. Upon successful login or registration, the server issues a signed JWT that the client stores in `localStorage` and attaches to every subsequent request via the `Authorization` header.

---

## Technology

| Component | Technology |
|---|---|
| Token standard | JSON Web Tokens (JWT) — RFC 7519 |
| Library | `jsonwebtoken` v9 |
| Password hashing | `bcryptjs` v3, 12 salt rounds |
| Middleware | Custom `authMiddleware.protect()` |
| Rate limiting | `express-rate-limit` — 20 req/15 min on auth routes |

---

## Registration Flow

```
Client                              Server                        Database
  │                                    │                               │
  │  POST /api/v1/auth/register        │                               │
  │  {name, email, password}           │                               │
  │───────────────────────────────────>│                               │
  │                                    │                               │
  │                          Validate fields                           │
  │                          (express-validator)                       │
  │                                    │                               │
  │                                    │  User.findOne({email})        │
  │                                    │──────────────────────────────>│
  │                                    │<──────────────────────────────│
  │                                    │  null (not found)             │
  │                                    │                               │
  │                          bcrypt.hash(password, 12)                 │
  │                                    │                               │
  │                                    │  User.create({name, email,    │
  │                                    │    hashedPassword, role:      │
  │                                    │    "student"})                │
  │                                    │──────────────────────────────>│
  │                                    │<──────────────────────────────│
  │                                    │  saved user doc               │
  │                                    │                               │
  │                          jwt.sign({userId, role}, JWT_SECRET,      │
  │                                   {expiresIn: JWT_EXPIRES_IN})     │
  │                                    │                               │
  │<───────────────────────────────────│                               │
  │  201 {token, user}                 │                               │
  │                                    │                               │
  │  Store token in localStorage       │                               │
```

---

## Login Flow

```
Client                              Server                        Database
  │                                    │                               │
  │  POST /api/v1/auth/login           │                               │
  │  {email, password}                 │                               │
  │───────────────────────────────────>│                               │
  │                                    │                               │
  │                          Validate fields                           │
  │                                    │                               │
  │                                    │  User.findOne({email})        │
  │                                    │  .select("+password")         │
  │                                    │──────────────────────────────>│
  │                                    │<──────────────────────────────│
  │                                    │  user doc with password hash  │
  │                                    │                               │
  │                          user.comparePassword(password)            │
  │                          (bcrypt.compare)                          │
  │                                    │                               │
  │                          jwt.sign({userId}, JWT_SECRET, ...)       │
  │                                    │                               │
  │<───────────────────────────────────│                               │
  │  200 {token, user}                 │                               │
```

---

## Protected Request Flow

```
Client                              Server
  │                                    │
  │  GET /api/v1/auth/profile          │
  │  Authorization: Bearer <token>     │
  │───────────────────────────────────>│
  │                                    │
  │                          authMiddleware.protect()
  │                          1. Extract token from Authorization header
  │                          2. jwt.verify(token, JWT_SECRET)
  │                          3. User.findById(decoded.userId)
  │                          4. Set req.user = user
  │                                    │
  │                          Controller executes
  │                                    │
  │<───────────────────────────────────│
  │  200 {user}                        │
```

---

## Token Structure

### JWT Payload (Decoded)
```json
{
  "userId": "64a1b2c3d4e5f6789012345",
  "iat": 1700000000,
  "exp": 1700604800
}
```

### Token Expiration
Controlled by the `JWT_EXPIRES_IN` environment variable. Default: `7d`.

---

## Client-Side Implementation

### AuthContext (`src/context/AuthContext.jsx`)

The `AuthContext` provides authentication state to the entire React app:

```
AuthContext:
  - user: Object | null
  - token: string | null
  - loading: boolean
  - login(email, password): Promise<void>
  - register(name, email, password): Promise<void>
  - logout(): void
```

**Token persistence:**
- On login/register: `localStorage.setItem('token', token)`
- On mount: reads token from `localStorage`, verifies by fetching profile
- On logout: `localStorage.removeItem('token')`, clears state

### Axios Interceptor (`src/api/axios.js`)

Every API call automatically attaches the token:

```javascript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Route Protection (`src/routes/`)

| Component | Behavior |
|---|---|
| `PrivateRoute` | Redirects to `/login` if no authenticated user |
| `PublicRoute` | Redirects to `/dashboard` if already authenticated |

---

## Server-Side Implementation

### `protect` Middleware (`server/middlewares/authMiddleware.js`)

```
1. Read req.headers.authorization
2. Check format: "Bearer <token>"
3. jwt.verify(token, JWT_SECRET) → decoded payload
4. User.findById(decoded.userId) → fetch user from DB
5. req.user = user
6. next()

Errors:
- No token → 401 "No token provided"
- Invalid token → 401 "Invalid token"
- User not found → 401 "User not found"
```

---

## Password Security

- Passwords are hashed with **bcryptjs** at a cost factor of **12**
- The `password` field has `select: false` — it is never returned in DB queries by default
- When login compares passwords, `.select('+password')` explicitly fetches the hash
- Plain-text passwords are never stored or logged

---

## Rate Limiting

Authentication routes have a stricter rate limit than the global limit:

| Route Group | Limit |
|---|---|
| All routes | 100 requests per 15 minutes per IP |
| `/api/v1/auth/*` | 20 requests per 15 minutes per IP |

This prevents brute-force attacks on login and registration endpoints.

---

## Security Considerations

| Concern | Mitigation |
|---|---|
| Brute-force login | Rate limiting on `/auth/*` routes |
| Token theft | Short expiry (`JWT_EXPIRES_IN=7d`); HTTPS in production |
| Password exposure | `select: false`, bcrypt hashing |
| HTTP header attacks | Helmet.js sets security headers |
| Token tampering | JWT signed with HS256; `JWT_SECRET` kept server-side |

---

*For API endpoint details see [API.md](./API.md)*
