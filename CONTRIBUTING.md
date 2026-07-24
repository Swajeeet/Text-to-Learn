# Contributing to Text-to-Learn

Thank you for your interest in contributing to Text-to-Learn! 🎉

This document explains how to get started, what we expect from contributors, and how to submit changes.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Code Style](#code-style)

---

## Code of Conduct

This project follows the [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards. Please report unacceptable behavior to the project maintainers.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Text-to-Learn.git
   cd Text-to-Learn
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/Swajeeet/Text-to-Learn.git
   ```
4. **Install dependencies** (see [Development Setup](#development-setup))

---

## Development Setup

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- MongoDB Atlas account (free tier)
- OpenRouter API key
- YouTube Data API v3 key

### Steps

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Fill in your credentials

# Start development servers (two terminals)
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev
```

See [docs/Deployment.md](./docs/Deployment.md) for detailed environment variable setup.

---

## How to Contribute

### Types of Contributions Welcome

- 🐛 Bug fixes
- ✨ New features (check [ROADMAP.md](./ROADMAP.md) for planned features)
- 📖 Documentation improvements
- 🎨 UI/UX improvements
- ⚡ Performance optimizations
- 🔒 Security improvements
- 🧪 Tests

### Workflow

1. **Sync with upstream** before starting:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes** — keep commits focused and atomic

4. **Test your changes** manually by running both client and server locally

5. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** against the `main` branch

---

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Use When |
|---|---|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code change that is neither a bug fix nor a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process or auxiliary tool changes |

### Examples

```
feat(ai): add model selection via environment variable
fix(auth): resolve token expiry not clearing localStorage
docs(api): add response examples for enrollment endpoints
refactor(services): extract PDF formatting into helper functions
```

---

## Pull Request Process

1. Fill out the [Pull Request Template](./.github/pull_request_template.md) completely
2. Link any related issues using `Closes #<issue-number>`
3. Ensure your changes do not break existing functionality
4. Keep PRs focused — one feature or fix per PR
5. Respond to review feedback promptly
6. PRs require approval from at least one maintainer before merging

### PR Checklist

- [ ] Followed the branching convention (`feature/`, `fix/`, `docs/`, etc.)
- [ ] Commit messages follow the Conventional Commits standard
- [ ] Tested changes locally (both client and server)
- [ ] Updated relevant documentation if applicable
- [ ] PR description clearly explains what changed and why
- [ ] No sensitive data (API keys, passwords) in commits

---

## Reporting Bugs

Use the [Bug Report template](./.github/ISSUE_TEMPLATE/bug_report.md) to file a bug.

Please include:
- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, Node.js version, browser)
- Any relevant error messages or screenshots

---

## Requesting Features

Use the [Feature Request template](./.github/ISSUE_TEMPLATE/feature_request.md) to propose a new feature.

Check the [ROADMAP.md](./ROADMAP.md) first to see if the feature is already planned.

---

## Code Style

### JavaScript (Backend — CommonJS)

- Use `const` for all declarations unless reassignment is needed
- Use `async/await` — avoid `.then()/.catch()` chains
- Use `asyncHandler` wrapper for all Express controllers
- Use `ApiResponse` and `ApiError` classes for all responses
- Add JSDoc comments to all exported functions

### JavaScript/JSX (Frontend — ES Modules)

- Use functional components and hooks only (no class components)
- Use `useAuth()` hook for authentication state
- Use centralized API modules in `src/api/` for all HTTP calls
- Use `react-hot-toast` for all user feedback

### General

- No `console.log` in production code (use logging with appropriate level)
- No hardcoded secrets or API keys
- Keep files focused — one concern per file
- Follow the existing folder structure

---

## Questions?

Open a [Question issue](./.github/ISSUE_TEMPLATE/question.md) or start a discussion in [GitHub Discussions](https://github.com/Swajeeet/Text-to-Learn/discussions).

---

Thank you for making Text-to-Learn better! 🚀
