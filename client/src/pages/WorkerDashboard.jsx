import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'
import StarRating from '../components/StarRating'
import Spinner from '../components/Spinner'

const WorkerDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

  useEffect(() => {
    fetchMyProfile()
  }, [])

  const fetchMyProfile = async () => {
    try {
      const { data } = await API.get('/workers/me')
      setProfile(data.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null) // No profile yet
      } else {
        setError('Failed to load your profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await API.delete(`/workers/${profile._id}`)
      setProfile(null)
      setShowDeleteModal(false)
    } catch {
      setError('Failed to delete profile. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <Spinner text="Loading your dashboard..." className="min-h-[calc(100vh-4rem)]" />
  }

  // No profile yet — show create prompt
  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-2xl mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Create Your Worker Profile
          </h2>
          <p className="text-text-secondary mb-8">
            Set up your professional profile to start getting hired on Karigar.pk. Add your skills, experience, and pricing.
          </p>
          <Link
            to="/dashboard/create-profile"
            className="inline-flex px-6 py-3 text-white bg-primary rounded-xl font-semibold hover:bg-primary-hover shadow-sm hover:shadow transition-all"
          >
            Create Profile
          </Link>
        </div>
      </div>
    )
  }

  // Profile exists — show dashboard
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Worker Dashboard</h1>
          <p className="text-text-secondary mt-1">Manage your professional profile</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/edit-profile"
            className="px-4 py-2 text-sm font-medium text-primary border border-primary/30 bg-primary-light/50 rounded-lg hover:bg-primary-light hover:border-primary/50 transition-all"
          >
            Edit Profile
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all"
          >
            Delete Profile
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Top section with image and basic info */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
          {/* Profile Image */}
          <div className="shrink-0">
            {profile.profileImage ? (
              <img
                src={`${API_BASE}${profile.profileImage}`}
                alt={user?.name}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-border"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-primary-light flex items-center justify-center border-2 border-border">
                <span className="text-3xl font-bold text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
              {profile.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            <p className="text-primary font-medium capitalize mb-3">
              {profile.category.replace('-', ' ')}
            </p>

            {profile.bio && (
              <p className="text-text-secondary text-sm leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="border-t border-border px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Experience */}
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Experience</p>
            <p className="text-text-primary font-semibold">{profile.experienceYears} years</p>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Location</p>
            <p className="text-text-primary font-semibold">{profile.city}</p>
            <p className="text-sm text-text-secondary">{profile.serviceArea}</p>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Pricing Range</p>
            <p className="text-text-primary font-semibold">
              Rs. {profile.pricing.min.toLocaleString()} — {profile.pricing.max.toLocaleString()}
            </p>
          </div>

          {/* Rating */}
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Rating</p>
            {profile.avgRating > 0 ? (
              <div className="flex items-center gap-1.5">
                <StarRating rating={Math.round(profile.avgRating)} size="sm" />
                <span className="text-text-primary font-semibold">{profile.avgRating.toFixed(1)}</span>
              </div>
            ) : (
              <p className="text-sm text-text-secondary">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="border-t border-border px-6 sm:px-8 py-6">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-3">Skills</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-primary-light text-primary text-sm font-medium rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-surface border border-border rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Delete Profile?</h3>
              <p className="text-sm text-text-secondary mb-6">
                This action cannot be undone. Your worker profile and all associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-text-secondary border border-border rounded-xl hover:bg-background transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkerDashboard
