import { useState } from 'react'

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'painter', label: 'Painter' },
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'ac-technician', label: 'AC Technician' },
  { value: 'other', label: 'Other' },
]

const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '4', label: '4+ Stars' },
  { value: '3', label: '3+ Stars' },
  { value: '2', label: '2+ Stars' },
  { value: '1', label: '1+ Stars' },
]

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value })
  }

  const hasActiveFilters = filters.category || filters.city || filters.minPrice || filters.maxPrice || filters.minRating

  return (
    <div>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl text-sm font-medium text-text-primary shadow-sm mb-4"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 bg-primary text-white text-xs font-semibold rounded-full">
              Active
            </span>
          )}
        </span>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Filter content — always visible on desktop, toggleable on mobile */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-5">
          {/* Header with reset */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="filter-category" className="block text-sm font-medium text-text-primary mb-1.5">
              Category
            </label>
            <select
              id="filter-category"
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label htmlFor="filter-city" className="block text-sm font-medium text-text-primary mb-1.5">
              City / Location
            </label>
            <input
              type="text"
              id="filter-city"
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. Lahore"
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Price Range (Rs.)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                placeholder="Min"
                min="0"
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                placeholder="Max"
                min="0"
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label htmlFor="filter-rating" className="block text-sm font-medium text-text-primary mb-1.5">
              Minimum Rating
            </label>
            <select
              id="filter-rating"
              value={filters.minRating}
              onChange={(e) => handleChange('minRating', e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Apply button (mobile only — desktop filters apply instantly) */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel
