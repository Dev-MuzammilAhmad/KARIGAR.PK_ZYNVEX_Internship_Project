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
      category,
      experienceYears,
      serviceArea,
      city,
      bio,
      profileImage,
    } = req.body

    // Parse skills (handles array, comma-separated string, JSON string, or single string from FormData)
    let parsedSkills = req.body.skills
    if (typeof parsedSkills === 'string') {
      try {
        const json = JSON.parse(parsedSkills)
        parsedSkills = Array.isArray(json) ? json : [json]
      } catch {
        parsedSkills = parsedSkills.split(',').map((s) => s.trim()).filter(Boolean)
      }
    }
    if (!Array.isArray(parsedSkills)) {
      parsedSkills = parsedSkills ? [parsedSkills] : []
    }
    parsedSkills = parsedSkills.map((s) => String(s).trim()).filter(Boolean)

    // Parse pricing (handles nested object, JSON string, or FormData 'pricing[min]' / 'pricing[max]')
    let parsedPricing = req.body.pricing
    if (typeof parsedPricing === 'string') {
      try {
        parsedPricing = JSON.parse(parsedPricing)
      } catch {}
    }
    if (!parsedPricing && (req.body['pricing[min]'] !== undefined || req.body['pricing[max]'] !== undefined)) {
      parsedPricing = {
        min: Number(req.body['pricing[min]']),
        max: Number(req.body['pricing[max]']),
      }
    } else if (parsedPricing) {
      parsedPricing = {
        min: Number(parsedPricing.min),
        max: Number(parsedPricing.max),
      }
    }

    // Validation
    if (!parsedSkills || parsedSkills.length === 0) {
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

    if (experienceYears === undefined || experienceYears === null || experienceYears === '') {
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

    if (!parsedPricing || isNaN(parsedPricing.min) || isNaN(parsedPricing.max)) {
      return res.status(400).json({
        success: false,
        message: 'Pricing range (min and max) is required',
      })
    }

    if (parsedPricing.min < 0 || parsedPricing.max < 0) {
      return res.status(400).json({
        success: false,
        message: 'Pricing values cannot be negative',
      })
    }

    if (parsedPricing.max < parsedPricing.min) {
      return res.status(400).json({
        success: false,
        message: 'Maximum price must be greater than or equal to minimum price',
      })
    }

    // Create the profile
    const workerProfile = await WorkerProfile.create({
      userId: req.user._id,
      skills: parsedSkills,
      category,
      experienceYears: Number(experienceYears),
      serviceArea: serviceArea.trim(),
      city: city.trim(),
      pricing: parsedPricing,
      bio: bio ? bio.trim() : '',
      profileImage: req.file ? `/uploads/${req.file.filename}` : (profileImage || ''),
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

// @desc    Get all worker profiles (with search, filter & pagination)
// @route   GET /api/workers?category=&city=&keyword=&minRating=&minPrice=&maxPrice=&page=&limit=
// @access  Public
export const getAllWorkers = async (req, res) => {
  try {
    const {
      category,
      city,
      keyword,
      minRating,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query

    // Build filter object
    const filter = {}

    // Category filter (exact match from enum)
    if (category) {
      filter.category = category.toLowerCase()
    }

    // City filter (case-insensitive partial match)
    if (city) {
      filter.city = { $regex: city, $options: 'i' }
    }

    // Keyword search — matches against skills, category, serviceArea, or bio
    if (keyword) {
      const keywordRegex = { $regex: keyword, $options: 'i' }
      filter.$or = [
        { skills: { $elemMatch: keywordRegex } },
        { category: keywordRegex },
        { serviceArea: keywordRegex },
        { bio: keywordRegex },
      ]
    }

    // Minimum rating filter
    if (minRating) {
      filter.avgRating = { $gte: Number(minRating) }
    }

    // Price range filters
    if (minPrice) {
      filter['pricing.min'] = { $gte: Number(minPrice) }
    }
    if (maxPrice) {
      filter['pricing.max'] = { $lte: Number(maxPrice) }
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12))
    const skip = (pageNum - 1) * limitNum

    // Execute query with filters and pagination
    const [workers, total] = await Promise.all([
      WorkerProfile.find(filter)
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      WorkerProfile.countDocuments(filter),
    ])

    const totalPages = Math.ceil(total / limitNum)

    res.json({
      success: true,
      count: workers.length,
      total,
      page: pageNum,
      totalPages,
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
  try {
    const worker = await WorkerProfile.findById(req.params.id)

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found',
      })
    }

    // Only the profile owner can update
    if (worker.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this profile',
      })
    }

    // Handle skills update
    if (req.body.skills !== undefined) {
      let parsedSkills = req.body.skills
      if (typeof parsedSkills === 'string') {
        try {
          const json = JSON.parse(parsedSkills)
          parsedSkills = Array.isArray(json) ? json : [json]
        } catch {
          parsedSkills = parsedSkills.split(',').map((s) => s.trim()).filter(Boolean)
        }
      }
      if (!Array.isArray(parsedSkills)) {
        parsedSkills = parsedSkills ? [parsedSkills] : []
      }
      parsedSkills = parsedSkills.map((s) => String(s).trim()).filter(Boolean)
      if (parsedSkills.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one skill is required',
        })
      }
      worker.skills = parsedSkills
    }

    if (req.body.category !== undefined) worker.category = req.body.category
    if (req.body.experienceYears !== undefined) worker.experienceYears = Number(req.body.experienceYears)
    if (req.body.serviceArea !== undefined) worker.serviceArea = req.body.serviceArea.trim()
    if (req.body.city !== undefined) worker.city = req.body.city.trim()
    if (req.body.bio !== undefined) worker.bio = req.body.bio ? req.body.bio.trim() : ''

    // Handle profile image upload via Multer
    if (req.file) {
      // Delete old image file if it exists
      if (worker.profileImage) {
        const oldImagePath = worker.profileImage.replace(/^\//, '')
        try {
          const fs = await import('fs')
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath)
          }
        } catch {
          // Ignore file deletion errors
        }
      }
      worker.profileImage = `/uploads/${req.file.filename}`
    }

    // Handle pricing update
    let parsedPricing = req.body.pricing
    if (typeof parsedPricing === 'string') {
      try {
        parsedPricing = JSON.parse(parsedPricing)
      } catch {}
    }
    if (!parsedPricing && (req.body['pricing[min]'] !== undefined || req.body['pricing[max]'] !== undefined)) {
      parsedPricing = {
        min: Number(req.body['pricing[min]']),
        max: Number(req.body['pricing[max]']),
      }
    } else if (parsedPricing) {
      parsedPricing = {
        min: Number(parsedPricing.min),
        max: Number(parsedPricing.max),
      }
    }

    if (parsedPricing) {
      if (isNaN(parsedPricing.min) || isNaN(parsedPricing.max)) {
        return res.status(400).json({
          success: false,
          message: 'Pricing range (min and max) is required',
        })
      }
      if (parsedPricing.min < 0 || parsedPricing.max < 0) {
        return res.status(400).json({
          success: false,
          message: 'Pricing values cannot be negative',
        })
      }
      if (parsedPricing.max < parsedPricing.min) {
        return res.status(400).json({
          success: false,
          message: 'Maximum price must be greater than or equal to minimum price',
        })
      }
      worker.pricing = parsedPricing
    }

    const updatedWorker = await worker.save()
    await updatedWorker.populate('userId', 'name email phone')

    res.json({
      success: true,
      message: 'Worker profile updated successfully',
      data: updatedWorker,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        success: false,
        message: messages[0],
      })
    }

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

// @desc    Delete a worker profile
// @route   DELETE /api/workers/:id
// @access  Private (owner only)
export const deleteWorkerProfile = async (req, res) => {
  try {
    const worker = await WorkerProfile.findById(req.params.id)

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found',
      })
    }

    // Only the profile owner can delete
    if (worker.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this profile',
      })
    }

    // Delete profile image file if it exists
    if (worker.profileImage) {
      const imagePath = worker.profileImage.replace(/^\//, '')
      try {
        const fs = await import('fs')
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      } catch {
        // Ignore file deletion errors
      }
    }

    await WorkerProfile.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Worker profile deleted successfully',
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
