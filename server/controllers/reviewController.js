import Review from '../models/Review.js'
import WorkerProfile from '../models/WorkerProfile.js'

// @desc    Create a review for a worker
// @route   POST /api/workers/:id/reviews
// @access  Private (customers only)
export const createReview = async (req, res) => {
  try {
    const { id: workerId } = req.params
    const { rating, comment } = req.body

    // Only customers can leave reviews
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Only customers can leave reviews',
      })
    }

    // Check if worker profile exists
    const worker = await WorkerProfile.findById(workerId)
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found',
      })
    }

    // Prevent workers from reviewing themselves
    if (worker.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review your own profile',
      })
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      })
    }

    // Validate comment length
    if (comment && comment.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 500 characters',
      })
    }

    // Check for duplicate review
    const existingReview = await Review.findOne({
      workerId,
      customerId: req.user._id,
    })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this worker',
      })
    }

    // Create review
    const review = await Review.create({
      workerId,
      customerId: req.user._id,
      rating,
      comment: comment || '',
    })

    // Recalculate avgRating for the worker
    const stats = await Review.aggregate([
      { $match: { workerId: worker._id } },
      {
        $group: {
          _id: '$workerId',
          avgRating: { $avg: '$rating' },
        },
      },
    ])

    if (stats.length > 0) {
      worker.avgRating = Math.round(stats[0].avgRating * 10) / 10
      await worker.save()
    }

    // Populate customer info for response
    await review.populate('customerId', 'name')

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this worker',
      })
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: messages[0],
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    })
  }
}

// @desc    Get all reviews for a worker
// @route   GET /api/workers/:id/reviews
// @access  Public
export const getWorkerReviews = async (req, res) => {
  try {
    const { id: workerId } = req.params

    // Check if worker profile exists
    const worker = await WorkerProfile.findById(workerId)
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found',
      })
    }

    const reviews = await Review.find({ workerId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    })
  }
}
