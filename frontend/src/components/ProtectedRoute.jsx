import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  console.log('ProtectedRoute - Token:', token ? 'Present' : 'Missing')
  console.log('ProtectedRoute - User:', user)
  console.log('ProtectedRoute - Required role:', role)
  
  if (!token || !user) {
    console.log('ProtectedRoute - Redirecting to login')
    return <Navigate to="/login" />
  }
  
  if (role && user.role !== role) {
    console.log('ProtectedRoute - Role mismatch, redirecting to home')
    return <Navigate to="/" />
  }
  
  console.log('ProtectedRoute - Access granted')
  return children
}
