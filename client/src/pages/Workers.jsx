import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import API from '../utils/api'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'

const DEFAULT_FILTERS = {
  category: '',
  city: '',
  minPrice: '',
  maxPrice: '',
  minRating: '',
}

const Workers = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
  })

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (keyword) params.append('keyword', keyword)
      if (filters.category) params.append('category', filters.category)
      if (filters.city) params.append('city', filters.city)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.minRating) params.append('minRating', filters.minRating)
      params.append('page', page)
      params.append('limit', 12)

      const { data } = await API.get(`/workers?${params.toString()}`)
      setWorkers(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      setWorkers([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [keyword, filters, page])

  // Sync URL search params
  useEffect(() => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (filters.category) params.set('category', filters.category)
    if (filters.city) params.set('city', filters.city)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.minRating) params.set('minRating', filters.minRating)
    if (page > 1) params.set('page', page)
    setSearchParams(params, { replace: true })
  }, [keyword, filters, page, setSearchParams])

  // Fetch on param change
  useEffect(() => {
    fetchWorkers()
  }, [fetchWorkers])

  const handleSearch = (query) => {
    setKeyword(query)
    setPage(1) // Reset to page 1 on new search
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1) // Reset to page 1 on filter change
  }

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS })
    setKeyword('')
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Find Workers</h1>
        <p className="text-text-secondary mt-1">
          Browse skilled professionals near you
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} initialValue={keyword} />
      </div>

      {/* Main layout — sidebar + results */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter sidebar */}
        <div className="md:w-64 shrink-0">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Results area */}
        <div className="flex-1">
          {/* Results count */}
          {!loading && (
            <p className="text-sm text-text-secondary mb-4">
              {total === 0
                ? 'No workers found'
                : `${total} worker${total !== 1 ? 's' : ''} found`}
            </p>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-text-secondary">
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Loading workers...</span>
              </div>
            </div>
          ) : workers.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-light rounded-2xl mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No workers found</h3>
              <p className="text-text-secondary text-sm mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 text-sm font-medium text-primary border border-primary/30 bg-primary-light/50 rounded-lg hover:bg-primary-light transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Worker cards grid */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workers.map((worker) => (
                  <Link
                    key={worker._id}
                    to={`/workers/${worker._id}`}
                    className="group bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    {/* Card top — image + category badge */}
                    <div className="relative p-4 pb-0 flex items-start gap-4">
                      {worker.profileImage ? (
                        <img
                          src={`${API_BASE}${worker.profileImage}`}
                          alt={worker.userId?.name}
                          className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-primary-light flex items-center justify-center border border-border shrink-0">
                          <span className="text-xl font-bold text-primary">
                            {worker.userId?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                          {worker.userId?.name || 'Worker'}
                        </h3>
                        <p className="text-sm text-primary font-medium capitalize mt-0.5">
                          {worker.category.replace('-', ' ')}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-sm text-text-secondary font-medium">
                            {worker.avgRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card details */}
                    <div className="p-4 pt-3 space-y-2">
                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="truncate">{worker.city} — {worker.serviceArea}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                        <span>
                          Rs. {worker.pricing.min.toLocaleString()} — {worker.pricing.max.toLocaleString()}
                        </span>
                      </div>

                      {/* Skills (first 3) */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {worker.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-primary-light text-primary text-xs font-medium rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {worker.skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-background text-text-secondary text-xs font-medium rounded-md">
                            +{worker.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-background transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) {
                          acc.push('...')
                        }
                        acc.push(p)
                        return acc
                      }, [])
                      .map((item, idx) =>
                        item === '...' ? (
                          <span key={`dots-${idx}`} className="px-2 text-text-secondary">
                            ...
                          </span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => setPage(item)}
                            className={`w-9 h-9 text-sm font-medium rounded-lg transition-all ${
                              page === item
                                ? 'bg-primary text-white'
                                : 'text-text-secondary hover:bg-background border border-border'
                            }`}
                          >
                            {item}
                          </button>
                        )
                      )}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-background transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Workers
