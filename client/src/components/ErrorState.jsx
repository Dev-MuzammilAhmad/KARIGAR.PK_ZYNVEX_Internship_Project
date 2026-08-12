import { Link } from 'react-router-dom'

const ErrorState = ({ title = 'Something went wrong', message = 'Please try again later.', onRetry }) => {
  return (
    <div className="flex items-center justify-center py-20 px-4">
      <div className="max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-4">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-sm mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-all"
            >
              Try Again
            </button>
          )}
          <Link
            to="/"
            className="px-5 py-2.5 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-background transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorState
