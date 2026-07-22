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
| Deployment | Frontend on Vercel, Backend on Render *(Phase 5)* |

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
