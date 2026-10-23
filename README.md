# BrightCore e-Recruitment web application

The candidate-facing careers site and the protected admin workspace for
BrightCore Technology Services.

The app talks to the BrightCore API in the `backend/` repository. Public
visitors can browse jobs and apply; BrightCore staff sign in once at
`/sign-in` and manage jobs and applications from `/admin`.

## Features

### Public site

- Landing page with live open roles from the API.
- Search job titles and summaries, filter by employment type, and paginate
  results.
- Loading skeletons, empty states, and retryable error states.
- Job detail pages with responsibilities, requirements, and closing date.
- Application form with validation and a required PDF CV (max 5 MB).
- Success confirmation and toast notifications; duplicate applications and
  closed jobs are reported clearly.
- Responsive layout with light and dark themes.

### Admin workspace

- Session-gated `/admin` area.
- Overview of total, open, closed, and draft jobs, plus application counts per
  job and per status.
- Paginated jobs table with status and title filters.
- Create and edit jobs, open or close them, and reopen closed roles.
- Per-job application lists with status filters and applicant search.
- Application detail sheet with cover note, CV metadata, and protected CV
  download.
- Accept or reject applicants and keep an internal note. Internal notes are
  never shown to candidates.
- Toast feedback for login, logout, job changes, status updates, and downloads.

### Authentication

- A single sign-in screen at `/sign-in`, used by staff for the admin workspace.
- The seeded administrator credentials come from the backend `.env`
  (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- `/admin/sign-in` redirects to `/sign-in`; there is no separate admin form.
- Candidate sign-up at `/sign-up` is a preview; candidate accounts are not
  implemented yet.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/Radix primitives |
| Data fetching | TanStack React Query |
| Forms and validation | React Hook Form, Zod |
| State | Zustand |
| Notifications | react-toastify |
| Icons | lucide-react |

## Project layout

```text
frontend/
├── app/
│   ├── (public)/            # Home, job detail, sign-in, sign-up
│   ├── (admin)/admin/       # Protected dashboard and job management
│   ├── layout.tsx           # Root layout and metadata
│   └── providers.tsx        # React Query and toast providers
├── src/
│   ├── components/
│   │   ├── admin/           # Shell, tables, forms, application detail
│   │   ├── auth/            # Shared sign-in screen
│   │   ├── home/            # Hero, search, open roles, newsletter
│   │   ├── jobs/            # Cards, filters, pagination, apply form
│   │   ├── layout/          # Header, footer, container, brand
│   │   ├── theme/           # Theme toggle and provider
│   │   └── ui/              # Shared UI primitives
│   ├── hooks/               # React Query hooks and mutations
│   ├── lib/                 # API clients, query keys, formatting
│   ├── stores/              # Zustand stores
│   └── types/               # API and admin types
├── proxy.ts                 # Redirects unauthenticated /admin visits
├── next.config.ts
├── package.json
└── README.md
```

## Prerequisites

- Node.js **20.9+** (Node 22 LTS or newer recommended)
- npm
- The backend API running at `http://localhost:8000` and seeded

## Quick start

Start the backend first (see `backend/README.md`), then:

```bash
cd frontend

# 1. Local environment
cp .env.example .env.local

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open:

| URL | Purpose |
| --- | --- |
| `http://localhost:3000` | Public careers site |
| `http://localhost:3000/sign-in` | Staff sign-in |
| `http://localhost:3000/admin` | Admin dashboard (after sign-in) |

Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from the backend `.env`. If
you have not created the account yet, run this in the backend repository:

```bash
uv run python -m backend.seed
```

## Environment variables

Copy `.env.example` to `.env.local`. These values are read when the server
starts, so restart `npm run dev` after changing them.

| Variable | Used by | Default | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Browser | `http://localhost:8000` | Public base URL of the API. |
| `API_URL` | Server-side code | Falls back to `NEXT_PUBLIC_API_URL` | API base URL for server-side fetches. Useful when the browser and server reach the API through different hosts (for example Docker). |

If neither is set, the app falls back to `http://localhost:8000`.

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Landing page with the open roles list. |
| `/jobs/[id]` | Public | Job detail and application form. |
| `/sign-in` | Public | The only sign-in form on the platform. |
| `/sign-up` | Public | Candidate sign-up preview. |
| `/admin` | Staff | Dashboard totals and per-job application counts. |
| `/admin/jobs` | Staff | Jobs table with filters and actions. |
| `/admin/jobs/new` | Staff | Create a job. |
| `/admin/jobs/[id]/edit` | Staff | Edit a job. |
| `/admin/jobs/[id]/applications` | Staff | Review that job's applications. |

`/admin/sign-in` is kept as a redirect to `/sign-in` for old bookmarks.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload. |
| `npm run build` | Create an optimized production build. |
| `npm start` | Serve the production build. |
| `npm run lint` | Run ESLint. |

There is no test script configured yet.

## How the frontend talks to the backend

- **Public pages** use the API client in `src/lib/api.ts` and React Query hooks
  such as `src/hooks/use-job-search.ts`. Job detail pages are fetched on the
  server.
- **Admin pages** use `src/lib/admin-api.ts` with `credentials: "include"` so
  the `brightcore_session` cookie travels with every request.
- **Route protection** happens in two layers:
  1. `proxy.ts` redirects unauthenticated `/admin/*` requests to
     `/sign-in?next=…` when the session cookie is absent.
  2. The admin shell calls `/api/v1/auth/me` in the browser and shows a
     session-expired screen if the cookie is no longer valid.
- **Applications** are submitted as `multipart/form-data` with the CV.
- **CV downloads** use the protected admin endpoint; the frontend never links
  directly to a storage path.
- **Toasts** are configured globally in `app/providers.tsx`, with the theme
  following light/dark mode.

## Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| Job list is empty or shows a network error | The backend is not running, or `NEXT_PUBLIC_API_URL` points to the wrong host. |
| Browser requests fail with CORS | Add `http://localhost:3000` to `CORS_ORIGINS` in the backend `.env` and restart the API. |
| Sign-in always returns `401` | Run `uv run python -m backend.seed` in the backend, then use the credentials from its `.env`. |
| Signed in but redirected back to `/sign-in` | The session cookie was not stored. Check that the frontend and API origins match your CORS and cookie settings, and keep `COOKIE_SECURE=false` on plain HTTP. |
| Admin pages show the session-expired screen | The session expired after 8 hours, or the backend restarted with a different `SECRET_KEY`. Sign in again. |
| Changes to `.env.local` have no effect | Restart the development server. |
| Build fails after switching branches | Remove `.next` and rebuild with `npm run build`. |

## Production build

```bash
npm ci
npm run build
npm start
```

Set `NEXT_PUBLIC_API_URL` to the public API origin at build time, and set
`API_URL` to the origin reachable from the Next.js server. The API must allow
the site's origin in `CORS_ORIGINS` and, when served over HTTPS, should use
`COOKIE_SECURE=true`.

## WATCH THE DEMO VIDEO HERE 

<!-- <img width="1306" height="738" alt="Screenshot From 2026-10-23 17-14-08" src="https://github.com/user-attachments/assets/efd45c64-10d2-48dc-ba04-869733f21b8d" /> -->
[![Watch the Demo Video](https://github.com/user-attachments/assets/efd45c64-10d2-48dc-ba04-869733f21b8d)](https://www.awesomescreenshot.com/video/57724061?key=dcf163a99d1d5b65cd177b5c308dde25)


