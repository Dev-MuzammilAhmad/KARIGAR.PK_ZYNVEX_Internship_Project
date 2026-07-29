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
import upload from '../middleware/upload.js'

const router = express.Router()

// Public routes
router.get('/', getAllWorkers)
router.get('/me', protect, getMyProfile) // Must be before /:id to avoid conflict
router.get('/:id', getWorkerById)

// Protected routes (with optional image upload)
router.post('/', protect, upload.single('profileImage'), createWorkerProfile)
router.put('/:id', protect, upload.single('profileImage'), updateWorkerProfile)
router.delete('/:id', protect, deleteWorkerProfile)

export default router
