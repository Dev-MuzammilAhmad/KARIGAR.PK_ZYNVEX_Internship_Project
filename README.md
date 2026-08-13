# Karigar.pk

**Pakistan's Local Service Marketplace** — connecting customers with skilled workers such as electricians, plumbers, carpenters, painters, mechanics, AC technicians, and other professionals.

Service providers create verified profiles with skills, experience, service areas, pricing, and contact info. Customers search and filter workers by location, category, ratings, availability, and budget, then contact them directly via WhatsApp or phone call — no intermediary involved.

---

## Features

### For Customers
- **Search & Filter** — find workers by keyword, category, city, price range, and minimum rating
- **Worker Listing** — browse results in a responsive card grid with pagination
- **Worker Profiles** — view detailed profiles with skills, bio, experience, pricing, and reviews
- **Direct Contact** — reach workers instantly via WhatsApp (pre-filled message) or phone call
- **Reviews & Ratings** — leave star ratings and comments for workers you've hired

### For Workers
- **Profile Creation** — build a professional profile with category, skills, experience, pricing, service area, and profile photo
- **Profile Management** — edit or delete your profile from the worker dashboard
- **Review Display** — see your average rating and all customer reviews

### Platform
- **User Authentication** — secure signup/login with JWT tokens and bcrypt password hashing
- **Role-Based Access** — customers and workers see different features; protected routes enforce authorization
- **Responsive Design** — mobile-first, works beautifully on all screen sizes
- **Security** — Helmet security headers, NoSQL injection prevention, rate limiting on auth routes

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React (Vite), React Router, Axios, Tailwind CSS v4 |
| Backend    | Node.js, Express.js, CORS               |
| Database   | MongoDB Atlas with Mongoose              |
| Auth       | JWT (jsonwebtoken) + bcryptjs            |
| Security   | Helmet, express-mongo-sanitize, express-rate-limit |
| Deployment | Frontend on Vercel, Backend on Render    |

---

## Project Structure

```
Karigar/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ErrorState.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   ├── ReviewList.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── StarRating.jsx
│   │   ├── context/           # React context (AuthContext)
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── WorkerDashboard.jsx
│   │   │   ├── WorkerProfile.jsx
│   │   │   ├── WorkerProfileForm.jsx
│   │   │   └── Workers.jsx
│   │   ├── utils/             # API config (Axios instance)
│   │   └── App.jsx            # Routes & layout
│   └── vercel.json            # Vercel deployment config
│
├── server/                    # Express backend
│   ├── config/                # Database connection
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   ├── reviewController.js
│   │   └── workerController.js
│   ├── middleware/            # Auth middleware (JWT verify)
│   ├── models/                # Mongoose schemas
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── WorkerProfile.js
│   ├── routes/                # Express route definitions
│   ├── uploads/               # Profile image storage
│   └── server.js              # Entry point
│
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/signup` | Public | Register a new user (customer or worker) |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/auth/me` | 🔒 | Get current user profile |

### Worker Profiles
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/workers` | Public | List/search workers with filters & pagination |
| `GET` | `/api/workers/:id` | Public | Get a single worker profile |
| `GET` | `/api/workers/me` | 🔒 Worker | Get logged-in worker's own profile |
| `POST` | `/api/workers` | 🔒 Worker | Create a worker profile (with image upload) |
| `PUT` | `/api/workers/:id` | 🔒 Owner | Update a worker profile |
| `DELETE` | `/api/workers/:id` | 🔒 Owner | Delete a worker profile |

### Reviews
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/workers/:id/reviews` | Public | Get all reviews for a worker |
| `POST` | `/api/workers/:id/reviews` | 🔒 Customer | Submit a review (1 per customer per worker) |

### Search Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category (e.g. `electrician`) |
| `city` | string | Case-insensitive city search |
| `keyword` | string | Search skills, category, service area, bio |
| `minRating` | number | Minimum average rating (1-5) |
| `minPrice` | number | Minimum price range |
| `maxPrice` | number | Maximum price range |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 12, max: 50) |

---

## Development Log

### Module 1 — Setup, Auth & Core Structure

- Project initialized with React (Vite) + Tailwind CSS frontend and Node/Express backend
- MongoDB Atlas connected via Mongoose; Users model with bcrypt password hashing
- JWT-based authentication: signup, login, and `/me` endpoint
- Protected route wrapper component; warm neutral theme (cream + brown #8B5E34)

### Module 2 — Worker Profiles CRUD

- WorkerProfile Mongoose model with skills, category, experience, pricing, service area, and profile image
- Full CRUD API: create, read, update, delete with ownership authorization
- Profile image upload via Multer with static file serving
- Worker dashboard, profile creation/edit form, and public worker profile page

### Module 3 — Search, Filter & Customer Side

- Extended `GET /api/workers` with query parameters for category, city, keyword, rating, and price filtering
- Pagination with `page` and `limit` support
- SearchBar, FilterPanel, and Workers listing page with responsive card grid
- URL search params synced for shareable/bookmarkable filtered results
- WhatsApp and Call buttons with pre-filled messages, phone validation, and mobile-friendly tap targets

### Module 4 — Reviews, Polish & Deployment

- **Reviews Model & API** — Review schema with rating (1-5) and comment; unique compound index prevents duplicates; avgRating auto-recalculated via MongoDB aggregation
- **Rating Display & Review Submission** — StarRating component (display + interactive modes); ReviewForm for logged-in customers; ReviewList with avatars, dates, and ratings
- **Average Rating Sync** — StarRating used across all pages; zero-reviews gracefully handled with "No reviews yet" fallback
- **UI Polish** — Reusable Spinner, ErrorState, and Footer components; global footer in App layout; clickable category cards on Home page linking to filtered search
- **Security Pass** — Helmet HTTP headers, express-mongo-sanitize (NoSQL injection prevention), rate limiting on auth routes (100 req/15min), JSON body size limit (10kb), input trimming and lowercasing on auth

---

## Setup / Installation

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB Atlas account (or local MongoDB)

### Run Frontend Locally

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Run Backend Locally

```bash
cd server
npm install

# Copy .env.example to .env and fill in your values
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
| `VITE_API_URL` | Backend API base URL (e.g. `https://your-backend.onrender.com/api`) |

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

---

## Security Measures

| Measure | Package/Method | Purpose |
|---------|---------------|---------|
| HTTP Headers | `helmet` | Sets secure HTTP headers (XSS, CSP, etc.) |
| NoSQL Injection | `express-mongo-sanitize` | Strips `$` and `.` from user input |
| Rate Limiting | `express-rate-limit` | 100 req/15min on auth routes |
| Body Size Limit | `express.json({ limit: '10kb' })` | Prevents large payload attacks |
| Password Hashing | `bcryptjs` | Salted hashing with 12 rounds |
| JWT Auth | `jsonwebtoken` | Stateless token-based authentication |
| Ownership Checks | Custom middleware | Only profile owners can update/delete |
| Input Sanitization | `trim()` + `toLowerCase()` | Clean email/name before DB operations |

---

## License

This project was built as part of the ZYNVEX Internship program.
