import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'
import StarRating from '../components/StarRating'

const WorkerProfile = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

  useEffect(() => {
    fetchWorker()
    fetchReviews()
  }, [id])

  const fetchWorker = async () => {
    setLoading(true)
    setNotFound(false)
    try {
      const { data } = await API.get(`/workers/${id}`)
      setWorker(data.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    setReviewsLoading(true)
    try {
      const { data } = await API.get(`/workers/${id}/reviews`)
      setReviews(data.data)
    } catch {
      setReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleReviewSubmitted = useCallback(() => {
    fetchReviews()
    fetchWorker() // Refresh to get updated avgRating
  }, [id])

  // Loading state
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

  // Not found state
  if (notFound || !worker) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-2xl mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">Profile Not Found</h2>
          <p className="text-text-secondary mb-8">
            The worker profile you're looking for doesn't exist or may have been removed.
          </p>
          <Link
            to="/"
            className="inline-flex px-6 py-3 text-white bg-primary rounded-xl font-semibold hover:bg-primary-hover shadow-sm hover:shadow transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const userName = worker.userId?.name || 'Worker'
  const userEmail = worker.userId?.email || ''
  const userPhone = worker.userId?.phone || ''

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary font-medium mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </Link>

      {/* Profile Card */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Hero section */}
        <div className="relative bg-gradient-to-r from-primary/10 to-primary-light/50 px-6 sm:px-8 pt-8 pb-20">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-surface/80 backdrop-blur text-primary text-xs font-semibold rounded-full capitalize border border-primary/20">
              {worker.category.replace('-', ' ')}
            </span>
            {worker.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50/80 backdrop-blur text-green-700 text-xs font-medium rounded-full border border-green-200/50">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Profile image + name (overlapping the hero) */}
        <div className="px-6 sm:px-8 -mt-14">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Image */}
            {worker.profileImage ? (
              <img
                src={`${API_BASE}${worker.profileImage}`}
                alt={userName}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-surface shadow-md"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-primary-light flex items-center justify-center border-4 border-surface shadow-md">
                <span className="text-3xl font-bold text-primary">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Name + basic info */}
            <div className="pt-2 sm:pt-8">
              <h1 className="text-2xl font-bold text-text-primary">{userName}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-text-secondary">
                {/* Location */}
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {worker.city}
                </span>
                {/* Experience */}
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                  {worker.experienceYears} {worker.experienceYears === 1 ? 'year' : 'years'} exp.
                </span>
                {/* Rating */}
                <span className="inline-flex items-center gap-1.5">
                  <StarRating rating={Math.round(worker.avgRating)} size="sm" />
                  <span className="text-sm font-medium text-text-secondary">
                    {worker.avgRating > 0 ? worker.avgRating.toFixed(1) : 'No reviews yet'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {worker.bio && (
          <div className="px-6 sm:px-8 pt-6">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">About</h3>
            <p className="text-text-secondary leading-relaxed">{worker.bio}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="px-6 sm:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Service Area */}
            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">Service Area</p>
              </div>
              <p className="text-text-primary font-semibold">{worker.serviceArea}</p>
            </div>

            {/* Pricing */}
            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">Pricing</p>
              </div>
              <p className="text-text-primary font-semibold">
                Rs. {worker.pricing.min.toLocaleString()} — {worker.pricing.max.toLocaleString()}
              </p>
            </div>

            {/* Experience */}
            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
                <p className="text-xs text-text-secondary uppercase tracking-wider font-medium">Experience</p>
              </div>
              <p className="text-text-primary font-semibold">
                {worker.experienceYears} {worker.experienceYears === 1 ? 'Year' : 'Years'}
              </p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="px-6 sm:px-8 pb-6">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-primary-light text-primary text-sm font-medium rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-border px-6 sm:px-8 py-6">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Contact</h3>

          {(() => {
            // Validate phone — must have at least 7 digits
            const rawDigits = userPhone.replace(/[^0-9]/g, '')
            const hasValidPhone = rawDigits.length >= 7

            // Pre-filled WhatsApp message
            const whatsappMessage = encodeURIComponent(
              `Hi ${userName}! I found your profile on Karigar.pk. I'm interested in your ${worker.category.replace('-', ' ')} services. Can we discuss?`
            )

            if (!hasValidPhone && !userEmail) {
              return (
                <p className="text-text-secondary text-sm">
                  No contact information available for this worker.
                </p>
              )
            }

            return (
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                {/* WhatsApp */}
                {hasValidPhone && (
                  <a
                    href={`https://wa.me/${rawDigits}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-12 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                )}

                {/* Phone Call */}
                {hasValidPhone && (
                  <a
                    href={`tel:${userPhone}`}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-12 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Call Now
                  </a>
                )}

                {/* Email */}
                {userEmail && (
                  <a
                    href={`mailto:${userEmail}?subject=${encodeURIComponent(`Inquiry from Karigar.pk — ${worker.category.replace('-', ' ')} services`)}`}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 min-h-12 border border-border text-text-primary rounded-xl font-semibold text-sm hover:bg-background hover:border-primary/30 transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Email
                  </a>
                )}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-text-primary mb-5">Reviews</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Form — shown only to logged-in customers */}
          {isAuthenticated && user?.role === 'customer' && (
            <div className="lg:col-span-1">
              <ReviewForm workerId={id} onReviewSubmitted={handleReviewSubmitted} />
            </div>
          )}

          {/* Reviews List */}
          <div className={isAuthenticated && user?.role === 'customer' ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <ReviewList reviews={reviews} loading={reviewsLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerProfile
