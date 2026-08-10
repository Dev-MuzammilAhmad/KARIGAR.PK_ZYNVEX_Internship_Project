import express from 'express'
import { createReview, getWorkerReviews } from '../controllers/reviewController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Public — get all reviews for a worker
router.get('/:id/reviews', getWorkerReviews)

// Protected — create a review (customers only)
router.post('/:id/reviews', protect, createReview)

export default router
