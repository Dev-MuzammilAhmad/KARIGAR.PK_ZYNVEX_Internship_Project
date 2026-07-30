import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../utils/api'

const CATEGORIES = [
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'painter', label: 'Painter' },
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'ac-technician', label: 'AC Technician' },
  { value: 'other', label: 'Other' },
]

const WorkerProfileForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isEditing = location.pathname.includes('edit')

  const [formData, setFormData] = useState({
    skills: '',
    category: '',
    experienceYears: '',
    serviceArea: '',
    city: '',
    pricingMin: '',
    pricingMax: '',
    bio: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [existingProfileId, setExistingProfileId] = useState(null)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEditing)

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

  // Load existing profile data when editing
  useEffect(() => {
    if (isEditing) {
      loadProfile()
    }
  }, [isEditing])

  const loadProfile = async () => {
    try {
      const { data } = await API.get('/workers/me')
      const p = data.data
      setExistingProfileId(p._id)
      setFormData({
        skills: p.skills.join(', '),
        category: p.category,
        experienceYears: p.experienceYears.toString(),
        serviceArea: p.serviceArea,
        city: p.city,
        pricingMin: p.pricing.min.toString(),
        pricingMax: p.pricing.max.toString(),
        bio: p.bio || '',
      })
      if (p.profileImage) {
        setImagePreview(`${API_BASE}${p.profileImage}`)
      }
    } catch {
      setApiError('Failed to load your profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (apiError) setApiError('')
    if (successMsg) setSuccessMsg('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Only JPEG, PNG, and WebP images are allowed' }))
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image must be less than 5MB' }))
      return
    }

    setImageFile(file)
    setErrors((prev) => ({ ...prev, image: '' }))

    // Preview
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.skills.trim()) {
      newErrors.skills = 'At least one skill is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.experienceYears) {
      newErrors.experienceYears = 'Experience is required'
    } else if (Number(formData.experienceYears) < 0 || Number(formData.experienceYears) > 50) {
      newErrors.experienceYears = 'Experience must be between 0 and 50 years'
    }

    if (!formData.serviceArea.trim()) {
      newErrors.serviceArea = 'Service area is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.pricingMin) {
      newErrors.pricingMin = 'Minimum price is required'
    } else if (Number(formData.pricingMin) < 0) {
      newErrors.pricingMin = 'Price cannot be negative'
    }

    if (!formData.pricingMax) {
      newErrors.pricingMax = 'Maximum price is required'
    } else if (Number(formData.pricingMax) < 0) {
      newErrors.pricingMax = 'Price cannot be negative'
    }

    if (formData.pricingMin && formData.pricingMax && Number(formData.pricingMax) < Number(formData.pricingMin)) {
      newErrors.pricingMax = 'Maximum price must be ≥ minimum price'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setApiError('')
    setSuccessMsg('')

    try {
      // Build FormData for multipart upload
      const submitData = new FormData()
      const skillsArray = formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      skillsArray.forEach((skill) => submitData.append('skills', skill))
      submitData.append('category', formData.category)
      submitData.append('experienceYears', formData.experienceYears)
      submitData.append('serviceArea', formData.serviceArea)
      submitData.append('city', formData.city)
      submitData.append('pricing[min]', formData.pricingMin)
      submitData.append('pricing[max]', formData.pricingMax)
      submitData.append('bio', formData.bio)

      if (imageFile) {
        submitData.append('profileImage', imageFile)
      }

      if (isEditing && existingProfileId) {
        await API.put(`/workers/${existingProfileId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setSuccessMsg('Profile updated successfully!')
      } else {
        await API.post('/workers', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setSuccessMsg('Profile created successfully!')
      }

      // Redirect to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (error) {
      setApiError(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-secondary">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          {isEditing ? 'Edit Your Profile' : 'Create Your Profile'}
        </h1>
        <p className="mt-2 text-text-secondary">
          {isEditing
            ? 'Update your professional information'
            : 'Fill in your details to start getting hired'}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Messages */}
        {apiError && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {apiError}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-xl object-cover border-2 border-border"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-primary-light flex items-center justify-center border-2 border-border">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                </div>
              )}
              <div>
                <label className="cursor-pointer px-4 py-2 text-sm font-medium text-primary border border-primary/30 bg-primary-light/50 rounded-lg hover:bg-primary-light transition-all">
                  Choose Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-text-secondary mt-1.5">JPEG, PNG, or WebP. Max 5MB.</p>
              </div>
            </div>
            {errors.image && (
              <p className="mt-1.5 text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-1.5">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-background border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                errors.category ? 'border-red-400' : 'border-border'
              }`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1.5 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-text-primary mb-1.5">
              Skills * <span className="text-text-secondary font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. Wiring, Fan Installation, Switch Repair"
              className={`w-full px-4 py-3 bg-background border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                errors.skills ? 'border-red-400' : 'border-border'
              }`}
            />
            {errors.skills && (
              <p className="mt-1.5 text-sm text-red-500">{errors.skills}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experienceYears" className="block text-sm font-medium text-text-primary mb-1.5">
              Experience (years) *
            </label>
            <input
              type="number"
              id="experienceYears"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              placeholder="e.g. 5"
              min="0"
              max="50"
              className={`w-full px-4 py-3 bg-background border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                errors.experienceYears ? 'border-red-400' : 'border-border'
              }`}
            />
            {errors.experienceYears && (
              <p className="mt-1.5 text-sm text-red-500">{errors.experienceYears}</p>
            )}
          </div>

          {/* City & Service Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-text-primary mb-1.5">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Lahore"
                className={`w-full px-4 py-3 bg-background border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                  errors.city ? 'border-red-400' : 'border-border'
                }`}
              />
              {errors.city && (
                <p className="mt-1.5 text-sm text-red-500">{errors.city}</p>
              )}
            </div>
            <div>
              <label htmlFor="serviceArea" className="block text-sm font-medium text-text-primary mb-1.5">
                Service Area *
              </label>
              <input
                type="text"
                id="serviceArea"
                name="serviceArea"
                value={formData.serviceArea}
                onChange={handleChange}
                placeholder="e.g. Gulberg, Model Town"
                className={`w-full px-4 py-3 bg-background border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                  errors.serviceArea ? 'border-red-400' : 'border-border'
                }`}
              />
              {errors.serviceArea && (
                <p className="mt-1.5 text-sm text-red-500">{errors.serviceArea}</p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Pricing Range (Rs.) *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="pricingMin"
                  value={formData.pricingMin}
                  onChange={handleChange}
                  placeholder="Min"
                  min="0"
                  className={`w-full px-4 py-3 bg-background border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                    errors.pricingMin ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.pricingMin && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.pricingMin}</p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  name="pricingMax"
                  value={formData.pricingMax}
                  onChange={handleChange}
                  placeholder="Max"
                  min="0"
                  className={`w-full px-4 py-3 bg-background border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                    errors.pricingMax ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.pricingMax && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.pricingMax}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-1.5">
              Bio <span className="text-text-secondary font-normal">(optional, max 500 chars)</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell customers about your experience and expertise..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />
            <p className="text-xs text-text-secondary mt-1 text-right">
              {formData.bio.length}/500
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 px-4 text-text-secondary border border-border rounded-xl font-medium hover:bg-background transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 text-white bg-primary rounded-xl font-semibold hover:bg-primary-hover shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Profile' : 'Create Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WorkerProfileForm
