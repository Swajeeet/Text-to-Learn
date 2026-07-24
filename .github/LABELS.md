# GitHub Labels — Text-to-Learn

This document lists the recommended GitHub labels for organizing issues and pull requests.

---

## Setup

Apply these labels via GitHub UI:  
**Repository → Issues → Labels → New Label**

Or use the GitHub CLI:
```bash
gh label create "bug" --color "d73a4a" --description "Something isn't working"
```

---

## Recommended Labels

### Type Labels

| Label | Color | Description |
|---|---|---|
| `bug` | `#d73a4a` (red) | Something isn't working |
| `enhancement` | `#a2eeef` (teal) | New feature or improvement |
| `documentation` | `#0075ca` (blue) | Documentation additions or updates |
| `question` | `#d876e3` (purple) | Further information is requested |
| `refactor` | `#e4e669` (yellow) | Code refactoring without behavior change |
| `performance` | `#0052cc` (dark blue) | Performance improvements |
| `security` | `#b60205` (dark red) | Security vulnerability or improvement |

### Status Labels

| Label | Color | Description |
|---|---|---|
| `needs-triage` | `#ededed` (light grey) | Awaiting maintainer review |
| `in-progress` | `#fbca04` (yellow) | Currently being worked on |
| `needs-review` | `#0075ca` (blue) | Ready for code review |
| `on-hold` | `#e4e669` (yellow) | Paused pending information or dependency |
| `wontfix` | `#ffffff` (white) | Will not be addressed |
| `duplicate` | `#cfd3d7` (grey) | Already reported/addressed |
| `invalid` | `#e4e669` (yellow) | Not a valid issue |

### Priority Labels

| Label | Color | Description |
|---|---|---|
| `priority: critical` | `#b60205` (dark red) | Must be fixed immediately |
| `priority: high` | `#d93f0b` (orange-red) | High priority |
| `priority: medium` | `#e4e669` (yellow) | Medium priority |
| `priority: low` | `#0e8a16` (green) | Low priority, nice-to-have |

### Area Labels

| Label | Color | Description |
|---|---|---|
| `area: frontend` | `#1d76db` (blue) | Frontend (React) related |
| `area: backend` | `#0075ca` (dark blue) | Backend (Express) related |
| `area: ai` | `#5319e7` (purple) | AI/LLM integration related |
| `area: database` | `#006b75` (teal) | Database/Mongoose related |
| `area: auth` | `#e11d48` (red) | Authentication related |
| `area: pdf` | `#b60205` (dark red) | PDF export related |
| `area: youtube` | `#c5221f` (red) | YouTube integration related |
| `area: deployment` | `#0075ca` (blue) | Deployment/DevOps related |

### Contributor Labels

| Label | Color | Description |
|---|---|---|
| `good first issue` | `#7057ff` (purple) | Good for newcomers |
| `help wanted` | `#008672` (green) | Extra attention is needed |

---

## GitHub Discussions Categories

Recommended categories to enable under **Repository → Discussions → Categories**:

| Category | Format | Description |
|---|---|---|
| **Announcements** | Announcement | Project news and updates |
| **General** | Open-ended Discussion | General discussion about the project |
| **Q&A** | Question/Answer | Get help with setup, usage, or debugging |
| **Ideas** | Open-ended Discussion | Propose and discuss new features |
| **Show and Tell** | Open-ended Discussion | Share what you built using Text-to-Learn |
| **Bugs** | Open-ended Discussion | Report bugs (before formal issue) |
