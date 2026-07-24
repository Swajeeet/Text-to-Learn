# Security Policy — Text-to-Learn

## Supported Versions

| Version | Supported |
|---|---|
| 1.x (current) | ✅ Active support |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub Issues.**

If you discover a security vulnerability in Text-to-Learn, please report it responsibly by:

1. **Opening a private security advisory** via [GitHub Security Advisories](https://github.com/Swajeeet/Text-to-Learn/security/advisories/new)

2. **Or contacting the maintainer directly** via GitHub: [@Swajeeet](https://github.com/Swajeeet)

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof of concept
- Any suggested fix if you have one

---

## Response Timeline

| Action | Timeline |
|---|---|
| Initial acknowledgment | Within 48 hours |
| Severity assessment | Within 1 week |
| Fix or mitigation | Depends on severity; critical issues prioritized |
| Public disclosure | After fix is released |

---

## Security Measures in Place

| Measure | Implementation |
|---|---|
| **Password hashing** | bcryptjs with 12 salt rounds |
| **JWT authentication** | Signed tokens with configurable expiry |
| **Rate limiting** | express-rate-limit on all routes; stricter on auth routes |
| **HTTP security headers** | Helmet.js middleware |
| **Input validation** | express-validator on all request bodies |
| **Environment variables** | Secrets stored in `.env` files, never in source code |
| **CORS** | Configurable origin restrictions |

---

## Security Best Practices for Deployers

- Use a strong, randomly generated `JWT_SECRET` (minimum 32 characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- Rotate API keys periodically
- Enable MongoDB Atlas IP allowlist (restrict to Railway's IPs when possible)
- Set `JWT_EXPIRES_IN` to a reasonable value (e.g., `7d` or shorter)
- Review and restrict CORS origins in production
- Monitor Railway and MongoDB Atlas logs for anomalies

---

## Out of Scope

The following are generally **not** considered security vulnerabilities for this project:

- Self-XSS attacks
- Issues in third-party services (OpenRouter, YouTube API, MongoDB Atlas, Vercel, Railway)
- Denial of Service attacks that only affect the reporter's own account
- Issues requiring physical access to a device

---

## Responsible Disclosure

We ask that you:
- Give us reasonable time to fix the issue before public disclosure
- Make a good faith effort to avoid privacy violations, destruction of data, or service interruption
- Not exploit the vulnerability beyond what is necessary to demonstrate the issue

We commit to:
- Acknowledging your report promptly
- Working to understand and fix the issue
- Keeping you informed of our progress
- Crediting you in the fix if you wish

Thank you for helping keep Text-to-Learn secure. 🔒
