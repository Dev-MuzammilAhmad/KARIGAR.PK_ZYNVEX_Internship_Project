# Karigar.pk

**Pakistan's Local Service Marketplace** — connecting customers with skilled workers such as electricians, plumbers, carpenters, painters, mechanics, AC technicians, and other professionals.

Service providers create verified profiles with skills, experience, service areas, pricing, and contact info. Customers search and filter workers by location, category, ratings, availability, and budget, then contact them directly via WhatsApp or phone call — no intermediary involved.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React (Vite), React Router, Axios, Tailwind CSS v4 |
| Backend    | Node.js, Express.js, CORS                |
| Database   | MongoDB Atlas with Mongoose               |
| Auth       | JWT (jsonwebtoken) + bcryptjs            |
| Deployment | Frontend on Vercel, Backend on Render    |

---

## Module 1 — Setup, Auth & Core Structure

### Phase 1 ✅ — Project Structure & Frontend Skeleton

- Monorepo layout with `/client` (React/Vite) and `/server` (Node/Express placeholder)
- React initialized with Vite, React Router, and Tailwind CSS v4
- Warm neutral theme with brown accent (`#8B5E34`) applied globally via Tailwind `@theme`
- **Navbar** — responsive with mobile hamburger menu, Karigar.pk branding, Login/Sign Up buttons (static)
- **Home page** — hero section, "How It Works" (3-step cards), popular categories grid (6 services), CTA banner, footer

### Phase 2 ✅ — Backend Setup & Database Connection

- Express.js server with CORS and JSON body parsing
- MongoDB Atlas connection via Mongoose (environment variable based)
- Server folder structure: `config/`, `models/`, `routes/`, `controllers/`, `middleware/`
- Health-check API route: `GET /api/health` — returns server status, uptime, and database connection state
- Nodemon for auto-reloading during development

### Phase 3 ✅ — Users Model & Auth API

- **User model**: name, email, password (hashed with bcrypt), phone, role (`customer` | `worker`), timestamps
- **Signup endpoint**: `POST /api/auth/signup` — validates input, checks duplicate email, hashes password, returns JWT
- **Login endpoint**: `POST /api/auth/login` — validates credentials, returns JWT
- **Get profile endpoint**: `GET /api/auth/me` — protected route, returns current user data
- **JWT middleware**: extracts Bearer token, verifies, and attaches user to request

### Phase 4 ✅ — Frontend Auth Integration

- **Login page** (`/login`) — email/password form with client-side validation, error display, loading state
- **Signup page** (`/signup`) — name, email, password, confirm password, phone (optional), role selector (customer/worker)
- **AuthContext** — React context providing `user`, `login()`, `signup()`, `logout()`, `isAuthenticated` across the app
- **Axios instance** — centralized API client with automatic JWT token injection via interceptor
- **Navbar updated** — shows user's name initial + Logout when logged in; Login/Sign Up when logged out
- **Form validation** — required fields, valid email, password length (6+), password match — on both frontend and backend

### Phase 5 ✅ — Environment Variables & Deployment

- `.env` files for both client and server with `.env.example` templates
- All secrets (MongoDB URI, JWT secret) excluded from version control via `.gitignore`
- **Vercel config** (`vercel.json`) — SPA rewrites for React Router
- **Render config** (`render.yaml`) — deployment blueprint with env var placeholders
- Deployment-ready: frontend on Vercel, backend on Render

---

## Setup / Installation

### Prerequisites
- Node.js (v18+)
- npm

### Run Frontend Locally

```bash
# From the project root
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Run Backend Locally

```bash
# From the project root
cd server
npm install

# Copy .env.example to .env and fill in your MongoDB Atlas URI
cp .env.example .env

npm run dev
```

The API will be available at `http://localhost:5000/`.
Health check: `http://localhost:5000/api/health`

---

## Environment Variables

### Server (`/server/.env`)
| Variable     | Description                          |
|-------------|--------------------------------------|
| `PORT`       | Server port (default: 5000)          |
| `MONGO_URI`  | MongoDB Atlas connection string      |
| `JWT_SECRET` | Secret key for signing JWT tokens    |
| `CLIENT_URL` | Frontend URL for CORS (default: http://localhost:5173) |

### Client (`/client/.env`)
| Variable       | Description                     |
|---------------|---------------------------------|
| `VITE_API_URL` | Backend API base URL            |

---

## Deployment

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Set **Root Directory** to `client`
4. Set **Framework Preset** to `Vite`
5. Add environment variable: `VITE_API_URL` = `https://your-render-backend-url.onrender.com/api`
6. Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `server`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
   - `CLIENT_URL` = your Vercel frontend URL
7. Deploy
