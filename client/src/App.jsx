import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import WorkerDashboard from './pages/WorkerDashboard'
import WorkerProfileForm from './pages/WorkerProfileForm'
import WorkerProfile from './pages/WorkerProfile'
import Workers from './pages/Workers'
import Footer from './components/Footer'

// Protected route wrapper — redirects to login if not authenticated
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-secondary">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Public worker routes */}
          <Route path="/workers" element={<Workers />} />
          <Route path="/workers/:id" element={<WorkerProfile />} />

          {/* Worker-only protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="worker">
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/create-profile"
            element={
              <ProtectedRoute requiredRole="worker">
                <WorkerProfileForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit-profile"
            element={
              <ProtectedRoute requiredRole="worker">
                <WorkerProfileForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
