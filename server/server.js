import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'
import workerRoutes from './routes/workerRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// HTTP security headers (cross-origin policy for static image serving)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// Core middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10kb' })) // Limit body size
app.use(express.urlencoded({ extended: true }))

// NoSQL injection sanitizer compatible with Express 5
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key]
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key])
    }
  }
}

app.use((req, res, next) => {
  if (req.body) sanitizeObject(req.body)
  if (req.params) sanitizeObject(req.params)
  if (req.query) sanitizeObject(req.query)
  next()
})

// Rate limiter for auth routes (prevent brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: { success: false, message: 'Too many requests. Please try again later.' },
})

// Serve uploaded files statically
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api', healthRoutes)
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/workers', reviewRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Karigar.pk API',
    docs: '/api/health — Check server & database status',
  })
})

// Global JSON error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error. Please try again later.',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Karigar.pk server running on port ${PORT}`)
})
