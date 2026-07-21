import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

// GET /api/health — confirm server + database connectivity
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  res.json({
    success: true,
    message: 'Karigar.pk API is running',
    server: {
      status: 'ok',
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
    },
    database: {
      status: dbStatus[dbState] || 'unknown',
      connected: dbState === 1,
    },
  })
})

export default router
