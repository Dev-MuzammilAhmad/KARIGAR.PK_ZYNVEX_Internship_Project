import axios from 'axios'

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const baseURL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('karigar_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
