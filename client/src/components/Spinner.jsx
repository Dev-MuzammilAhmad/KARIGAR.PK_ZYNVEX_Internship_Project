const Spinner = ({ text = 'Loading...', className = '' }) => {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="flex items-center gap-3 text-text-secondary">
        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>{text}</span>
      </div>
    </div>
  )
}

export default Spinner
