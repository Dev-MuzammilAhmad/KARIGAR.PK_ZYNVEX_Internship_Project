# Karigar.pk

**Pakistan's Local Service Marketplace** — connecting customers with skilled workers such as electricians, plumbers, carpenters, painters, mechanics, AC technicians, and other professionals.

Service providers create verified profiles with skills, experience, service areas, pricing, and contact info. Customers search and filter workers by location, category, ratings, availability, and budget, then contact them directly via WhatsApp or phone call — no intermediary involved.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React (Vite), React Router, Axios, Tailwind CSS v4 |
| Backend    | Node.js, Express.js *(Phase 2)*         |
| Database   | MongoDB Atlas with Mongoose *(Phase 2)* |
| Auth       | JWT + bcrypt *(Phase 3–4)*              |
| Deployment | Frontend on Vercel, Backend on Render *(Phase 5)* |

---

## Module 1 — Setup, Auth & Core Structure

### Phase 1 ✅ — Project Structure & Frontend Skeleton

- Monorepo layout with `/client` (React/Vite) and `/server` (Node/Express placeholder)
- React initialized with Vite, React Router, and Tailwind CSS v4
- Warm neutral theme with brown accent (`#8B5E34`) applied globally via Tailwind `@theme`
- **Navbar** — responsive with mobile hamburger menu, Karigar.pk branding, Login/Sign Up buttons (static)
- **Home page** — hero section, "How It Works" (3-step cards), popular categories grid (6 services), CTA banner, footer

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
*(Coming in Phase 2)*

---

## Environment Variables

*(No environment variables required yet — will be added in Phase 2+)*
