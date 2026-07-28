import WorkerProfile from '../models/WorkerProfile.js'

// @desc    Create a worker profile
// @route   POST /api/workers
// @access  Private (worker only)
export const createWorkerProfile = async (req, res) => {
  try {
    // Only users with role "worker" can create a profile
    if (req.user.role !== 'worker') {
      return res.status(403).json({
        success: false,
        message: 'Only users with role "worker" can create a worker profile',
      })
    }

    // Check if worker already has a profile
    const existingProfile = await WorkerProfile.findOne({ userId: req.user._id })
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'You already have a worker profile. Use PUT to update it.',
      })
    }

    const {
      skills,
      category,
      experienceYears,
      serviceArea,
      city,
      pricing,
      bio,
      profileImage,
    } = req.body

    // Validation
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one skill is required',
      })
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      })
    }

    if (experienceYears === undefined || experienceYears === null) {
      return res.status(400).json({
        success: false,
        message: 'Experience in years is required',
      })
    }

    if (!serviceArea || !city) {
      return res.status(400).json({
        success: false,
        message: 'Service area and city are required',
      })
    }

    if (!pricing || pricing.min === undefined || pricing.max === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Pricing range (min and max) is required',
      })
    }

    if (pricing.min < 0 || pricing.max < 0) {
      return res.status(400).json({
        success: false,
        message: 'Pricing values cannot be negative',
      })
    }

    if (pricing.max < pricing.min) {
      return res.status(400).json({
        success: false,
        message: 'Maximum price must be greater than or equal to minimum price',
      })
    }

    // Create the profile
    const workerProfile = await WorkerProfile.create({
      userId: req.user._id,
      skills,
      category,
      experienceYears,
      serviceArea,
      city,
      pricing,
      bio: bio || '',
      profileImage: profileImage || '',
    })

    // Populate user info in the response
    await workerProfile.populate('userId', 'name email phone')

    res.status(201).json({
      success: true,
      message: 'Worker profile created successfully',
      data: workerProfile,
    })
  } catch (error) {
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

// @desc    Get all worker profiles
// @route   GET /api/workers
// @access  Public
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await WorkerProfile.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: workers.length,
      data: workers,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    })
  }
}

// @desc    Get a single worker profile by ID
// @route   GET /api/workers/:id
// @access  Public
export const getWorkerById = async (req, res) => {
  try {
    const worker = await WorkerProfile.findById(req.params.id)
      .populate('userId', 'name email phone')

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found',
      })
    }

    res.json({
      success: true,
      data: worker,
    })
  } catch (error) {
    // Handle invalid ObjectId format
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

// @desc    Get logged-in worker's own profile
// @route   GET /api/workers/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const worker = await WorkerProfile.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone')

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'You have not created a worker profile yet',
      })
    }

    res.json({
      success: true,
      data: worker,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    })
  }
}

// @desc    Update a worker profile
// @route   PUT /api/workers/:id
// @access  Private (owner only)
export const updateWorkerProfile = async (req, res) => {
  // TODO: Implement in Phase 3
  res.status(501).json({ success: false, message: 'Not implemented yet' })
}

// @desc    Delete a worker profile
// @route   DELETE /api/workers/:id
// @access  Private (owner only)
export const deleteWorkerProfile = async (req, res) => {
  // TODO: Implement in Phase 3
  res.status(501).json({ success: false, message: 'Not implemented yet' })
}
