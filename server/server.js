import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', healthRoutes)
app.use('/api/auth', authRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Karigar.pk API',
    docs: '/api/health — Check server & database status',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Karigar.pk server running on port ${PORT}`)
})
