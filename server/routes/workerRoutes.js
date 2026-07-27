import express from 'express'
import {
  createWorkerProfile,
  getAllWorkers,
  getWorkerById,
  getMyProfile,
  updateWorkerProfile,
  deleteWorkerProfile,
} from '../controllers/workerController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getAllWorkers)
router.get('/me', protect, getMyProfile) // Must be before /:id to avoid conflict
router.get('/:id', getWorkerById)

// Protected routes
router.post('/', protect, createWorkerProfile)
router.put('/:id', protect, updateWorkerProfile)
router.delete('/:id', protect, deleteWorkerProfile)

export default router
