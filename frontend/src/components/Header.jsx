import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Header() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (token && userData) {
      setUser(userData)
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">🌊</span>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-800">Indian Ocean Hazard Reporting Platform</div>
              <div className="text-xs text-green-600 font-medium">INCOIS - MoES</div>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-gray-700">
          <Link className="hover:text-blue-600 flex items-center gap-2 transition" to="/">
            <span>📋</span> Home
          </Link>
          {isAuthenticated && (
            <>
              <Link className="hover:text-blue-600 flex items-center gap-2 transition" to="/dashboard">
                <span>📊</span> Dashboard
              </Link>
              <Link className="hover:text-blue-600 flex items-center gap-2 transition" to="/profile">
                <span>👤</span> Profile
              </Link>
            </>
          )}
          <Link className="hover:text-blue-600 flex items-center gap-2 transition" to="/community">
            <span>👥</span> Community
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Logout
                </button>
              </div>
              <Link
                to="/report"
                className="inline-flex items-center gap-2 
             text-white px-6 py-3 rounded-lg font-medium 
             transition-colors
             bg-[linear-gradient(to_right,#062647,#0A5276,#1B8D98)]
             hover:bg-[linear-gradient(to_right,#0A3044,#0D638A,#22A1B2)]"
              >
                Report Hazard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md  bg-[linear-gradient(to_right,#062647,#0A5276,#1B8D98)]
              text-white hover:bg-[linear-gradient(to_right,#0A3044,#0D638A,#22A1B2)]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
