import { useState } from 'react'

const StarRating = ({ rating, onRate, size = 'md', interactive = false }) => {
  const [hovered, setHovered] = useState(0)

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const sizeClass = sizes[size] || sizes.md

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? star <= (hovered || rating) : star <= rating

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform disabled:cursor-default`}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <svg
              className={`${sizeClass} ${filled ? 'text-yellow-500' : 'text-border'} transition-colors`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
