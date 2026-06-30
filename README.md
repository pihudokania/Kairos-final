# KAIROS — Full-Stack Build

## 1. What was actually wrong

Your three files (`Kairos.css`, `Kairos_index.html`, `Kairos.js`) were a **front-end-only demo**:

- There was no `fetch()`, no API call, no backend reference anywhere in the JS. Every "AI insight," mission card, achievement, and stat was either static HTML or a `setInterval` faking movement with `Math.random()`. There was nothing to "not work" — there was no backend to connect to.
- **Case-sensitivity bug**: the files were named `Kairos.css` / `Kairos.js` (capital K) but `index.html` referenced lowercase `kairos.css` / `kairos.js`. This works on Windows/Mac (case-insensitive filesystems) but **404s on Linux servers** — which is what Render, Vercel, and Netlify all run. Fixed by renaming the files to lowercase.
- Zero responsive breakpoints (`@media` queries) existed — the sidebar and grids were fixed-width and would overflow/break under ~1024px.
- Icon-only buttons (`✕ Exit`, `✕ Exit Focus`) had no `aria-label`, and the decorative canvas wasn't marked `aria-hidden`.
- `celebrateAch()` and `addMission()` had no persistence — refresh the page and every "achievement unlocked" or "new mission" vanished.

## 2. What was built

A real Node.js + Express + MongoDB backend, plus the minimum front-end wiring needed to make the **stateful** parts of the UI (Missions, Achievements, Stats) actually persist, while leaving purely cosmetic/animated pieces (particles, focus/crisis countdown timers, confetti) as client-side — there's no meaningful "backend" for a CSS animation.

### Backend stack
**Node.js + Express + MongoDB (Mongoose)** — the standard, fastest-to-ship choice for a project of this shape; no part of this app needs a different stack (no heavy compute, no real-time sockets currently used, no need for a relational schema).

## 3. Folder structure

```
kairos/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── missionController.js   # Mission CRUD + lightweight "AI planner" heuristic
│   │   ├── achievementController.js
│   │   ├── reflectionController.js
│   │   └── statsController.js     # backs momentum/XP/level numbers
│   ├── middleware/
│   │   └── errorMiddleware.js     # 404 + centralized error handler
│   ├── models/
│   │   ├── Mission.js
│   │   ├── Achievement.js
│   │   ├── Reflection.js
│   │   └── UserStats.js
│   ├── routes/
│   │   ├── missionRoutes.js       # includes express-validator rules
│   │   ├── achievementRoutes.js
│   │   ├── reflectionRoutes.js
│   │   └── statsRoutes.js
│   ├── utils/
│   │   └── seed.js                # seeds DB with the original demo data
│   ├── .env.example
│   ├── .gitignore
│   ├── render.yaml                # Render deploy config
│   ├── package.json
│   └── server.js                  # helmet, cors, rate-limit, morgan, routes
│
└── frontend/
    ├── index.html                 # same UI, lowercase asset refs, API config script, a11y fixes
    ├── kairos.css                 # original styles + responsive @media block appended
    ├── kairos.js                  # original behavior + fetch()-based API wiring
    └── vercel.json
```

## 4. API endpoints implemented

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | health check (Render uses this) |
| GET | `/api/missions` | list missions (filter via `?status=` / `?priority=`) |
| POST | `/api/missions` | create mission — used by `addMission()` |
| GET | `/api/missions/:id` | get one |
| PUT | `/api/missions/:id` | update progress/status/etc. |
| DELETE | `/api/missions/:id` | delete |
| GET | `/api/achievements` | list achievements |
| PATCH | `/api/achievements/:key/unlock` | unlock — used by `celebrateAch()` |
| GET | `/api/reflections` | list nightly reflections |
| POST | `/api/reflections` | create one |
| GET | `/api/stats` | momentum/focus/energy/XP/level |
| PUT | `/api/stats` | bulk update stats |
| PATCH | `/api/stats/momentum` | nudge momentum — replaces the old `Math.random()` drift |

All write routes are validated with `express-validator`; all errors funnel through a single Express error-handling middleware (no unhandled promise rejections — every controller is wrapped in `express-async-handler`).

## 5. Installation

```bash
# Backend
cd kairos/backend
npm install
cp .env.example .env        # then edit .env — see below
npm run seed                # populates Mongo with the original demo data
npm run dev                 # nodemon, http://localhost:5000

# Frontend
cd kairos/frontend
# any static server works, e.g.:
npx serve .                 # or open index.html directly, or use VS Code Live Server
```

## 6. Environment variables (`backend/.env`)

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/kairos?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5500,https://your-frontend.vercel.app
```

Get `MONGO_URI` from **MongoDB Atlas → Database → Connect → Drivers**. `CLIENT_ORIGIN` is a comma-separated allowlist used by the CORS middleware — add your real deployed frontend URL once you have it, or requests will be blocked.

The frontend has one equivalent setting, in `index.html`, right above the `<script src="kairos.js">` tag:

```html
<script>
  window.KAIROS_API_BASE = 'https://your-backend.onrender.com/api';
</script>
```

## 7. Deployment

**Database — MongoDB Atlas**
1. Create a free M0 cluster.
2. Database Access → add a user/password.
3. Network Access → allow `0.0.0.0/0` (or Render's IPs) so Render can connect.
4. Copy the connection string into Render's env vars (next step).

**Backend — Render**
1. Push `kairos/backend` to a GitHub repo (`render.yaml` is already there).
2. Render → New → Blueprint → point at the repo (or New → Web Service, Build: `npm install`, Start: `npm start`).
3. Set `MONGO_URI` and `CLIENT_ORIGIN` in Render's dashboard env vars (they're marked `sync: false` in `render.yaml` so Render will prompt for them — never commit secrets).
4. Once deployed, run `npm run seed` once locally with `MONGO_URI` pointed at Atlas, or add a one-off Render job, to seed initial data.

**Frontend — Vercel or Netlify**
1. Push `kairos/frontend` to a repo (or the same repo, different root).
2. Vercel: New Project → set root directory to `frontend` → deploy (it's static, no build step needed).
3. Before deploying, set `window.KAIROS_API_BASE` in `index.html` to your live Render URL + `/api`.
4. After both are live, go back to Render's `CLIENT_ORIGIN` env var and add the final Vercel URL, then redeploy the backend so CORS allows it.

## 8. Testing checklist

- [ ] `GET /api/health` returns `{"success":true,...}`
- [ ] `GET /api/missions` returns seeded missions
- [ ] `POST /api/missions` with empty `name` returns 400 with validation message
- [ ] `POST /api/missions` with valid `name` returns 201 + a mission with AI-generated subtasks/estimate
- [ ] `PATCH /api/achievements/seven-day-streak/unlock` returns the updated achievement
- [ ] `PATCH /api/stats/momentum` returns a momentum value that moves and stays within 0–100
- [ ] Frontend: clicking **Launch Mission Control** calls `loadMissions()` and renders a "Loading your missions…" → real cards (or a clear error if the backend is down)
- [ ] Frontend: **+ New Mission** prompt → optimistic "AI Planning..." card → replaced with the real saved card after the API responds
- [ ] Frontend: clicking an achievement fires confetti **and** a network call to unlock it (check Network tab)
- [ ] Resize the browser to ~375px width — sidebar collapses to a top bar, dashboard grid goes to a single column, nothing overflows horizontally
- [ ] CORS: deployed frontend can call the deployed backend without console errors (you must add the real Vercel URL to `CLIENT_ORIGIN` on Render)

## 9. What was intentionally left as front-end-only

Focus Mode and Crisis Mode countdown timers, the particle canvas background, and the "agent thinking" text sequence in `simulateFuture()` are presentation/animation logic with no real data behind them in the original design — there's nothing meaningful to persist server-side for a decorative countdown or particle system, so these were left untouched rather than padded out with fake endpoints. If you want focus-session history actually tracked (e.g., for the "Focus Master" achievement to unlock for real), that's a natural next addition — a `FocusSession` model + a route hit on `closeFocus()`.
