import mongoose from 'mongoose'

const workerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true, // One profile per user
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one skill is required',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'electrician',
          'plumber',
          'carpenter',
          'painter',
          'mechanic',
          'ac-technician',
          'other',
        ],
        message: 'Category must be one of: electrician, plumber, carpenter, painter, mechanic, ac-technician, other',
      },
    },
    experienceYears: {
      type: Number,
      required: [true, 'Experience in years is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience cannot exceed 50 years'],
    },
    serviceArea: {
      type: String,
      required: [true, 'Service area is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    pricing: {
      min: {
        type: Number,
        required: [true, 'Minimum pricing is required'],
        min: [0, 'Minimum price cannot be negative'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum pricing is required'],
        min: [0, 'Maximum price cannot be negative'],
      },
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
)

// Validate that pricing.max >= pricing.min
workerProfileSchema.pre('validate', function () {
  if (this.pricing && this.pricing.max < this.pricing.min) {
    this.invalidate('pricing.max', 'Maximum price must be greater than or equal to minimum price')
  }
})

const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema)

export default WorkerProfile
