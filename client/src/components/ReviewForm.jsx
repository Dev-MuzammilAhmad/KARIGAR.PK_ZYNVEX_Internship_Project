import { useState } from 'react'
import API from '../utils/api'
import StarRating from './StarRating'

const ReviewForm = ({ workerId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setIsSubmitting(true)
    try {
      await API.post(`/workers/${workerId}/reviews`, { rating, comment })
      setSuccess('Review submitted successfully!')
      setRating(0)
      setComment('')
      onReviewSubmitted?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
        Leave a Review
      </h4>

      {error && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Your Rating *
          </label>
          <StarRating rating={rating} onRate={setRating} size="lg" interactive />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-text-primary mb-1.5">
            Comment <span className="text-text-secondary font-normal">(optional, max 500 chars)</span>
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this worker..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary text-sm placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
          />
          <p className="text-xs text-text-secondary mt-1 text-right">
            {comment.length}/500
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
