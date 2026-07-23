import { createContext, useContext, useState, useEffect } from 'react'
import API from '../utils/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, check if a token exists and fetch user profile
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('karigar_token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await API.get('/auth/me')
        setUser(data.data)
      } catch {
        // Token is invalid or expired — clear it
        localStorage.removeItem('karigar_token')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const signup = async (formData) => {
    const { data } = await API.post('/auth/signup', formData)
    localStorage.setItem('karigar_token', data.data.token)
    setUser(data.data)
    return data
  }

  const login = async (formData) => {
    const { data } = await API.post('/auth/login', formData)
    localStorage.setItem('karigar_token', data.data.token)
    setUser(data.data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('karigar_token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
