import StarRating from './StarRating'

const ReviewList = ({ reviews, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="flex items-center gap-3 text-text-secondary">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm">Loading reviews...</span>
        </div>
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-light rounded-xl mb-3">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <p className="text-text-secondary text-sm">No reviews yet. Be the first to leave one!</p>
      </div>
    )
  }

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-background border border-border rounded-xl p-4"
        >
          {/* Header — name + date */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">
                  {review.customerId?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {review.customerId?.name || 'Anonymous'}
                </p>
                <p className="text-xs text-text-secondary">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-sm text-text-secondary leading-relaxed mt-2 pl-12">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReviewList
