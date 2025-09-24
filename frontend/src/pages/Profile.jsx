import { useState, useEffect } from 'react'
import { getProfile, uploadProfilePicture, updateProfile } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if user is authenticated
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      
      if (!token || !user) {
        setError('Please log in to view your profile')
        navigate('/login')
        return
      }

      const [profileData, statsData, reportsData] = await Promise.all([
        getProfile(),
        getProfileStats(),
        getProfileReports()
      ])
      
      setProfile(profileData)
      setStats(statsData)
      setReports(reportsData)
    } catch (e) {
      console.error('Profile load error:', e)
      if (e.response?.status === 401) {
        setError('Session expired. Please log in again.')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } else {
        setError('Failed to load profile data. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getProfileStats = async () => {
    const token = localStorage.getItem('token')
    console.log('🔍 Fetching profile stats...')
    console.log('Token exists:', !!token)
    console.log('API Base:', import.meta.env.VITE_API_BASE || 'http://localhost:4000')
    
    try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/profile/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      console.log('Stats response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Stats response error:', errorText)
        throw new Error(`Failed to fetch stats: ${response.status} ${errorText}`)
      }
      
      const data = await response.json()
      console.log('✅ Stats data:', data)
      return data
    } catch (error) {
      console.error('❌ Error fetching stats:', error)
      throw error
    }
  }

  const getProfileReports = async () => {
    const token = localStorage.getItem('token')
    console.log('🔍 Fetching profile reports...')
    console.log('Token exists:', !!token)
    
    try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/profile/reports`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      console.log('Reports response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Reports response error:', errorText)
        throw new Error(`Failed to fetch reports: ${response.status} ${errorText}`)
      }
      
      const data = await response.json()
      console.log('✅ Reports data:', data)
      return data
    } catch (error) {
      console.error('❌ Error fetching reports:', error)
      throw error
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getRoleDisplay = (role) => {
    const roleMap = {
      'citizen': 'Community Member',
      'officer': 'Safety Officer',
      'analyst': 'Data Analyst'
    }
    return roleMap[role] || role
  }

  const getRoleBadge = (role) => {
    const badgeMap = {
      'citizen': 'Community Member',
      'officer': 'Verified Officer',
      'analyst': 'Verified Analyst'
    }
    return badgeMap[role] || 'Member'
  }

  const getRoleColor = (role) => {
    const colorMap = {
      'citizen': 'bg-blue-100 text-blue-800',
      'officer': 'bg-green-100 text-green-800',
      'analyst': 'bg-purple-100 text-purple-800'
    }
    return colorMap[role] || 'bg-gray-100 text-gray-800'
  }

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const result = await uploadProfilePicture(file)
      setProfile(prev => ({ ...prev, profile_pic: result.profile_pic }))
      
      // Update localStorage user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      userData.profile_pic = result.profile_pic
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (e) {
      setError('Failed to upload profile picture')
      console.error('Upload error:', e)
    } finally {
      setUploading(false)
    }
  }

  const handleEditProfile = () => {
    setEditForm({
      name: profile.name,
      location: profile.location || '',
      bio: profile.bio || '',
      phone: profile.phone || ''
    })
    setEditing(true)
  }

  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile(editForm)
      setProfile(result.user)
      setEditing(false)
      
      // Update localStorage user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      Object.assign(userData, result.user)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (e) {
      setError('Failed to update profile')
      console.error('Update error:', e)
    }
  }

  const handleCancelEdit = () => {
    setEditing(false)
    setEditForm({})
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.profile_pic ? (
                  <img 
                    src={profile.profile_pic} 
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(profile.name)
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                )}
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <span className={`${getRoleColor(profile.role)} text-sm font-medium px-2.5 py-0.5 rounded-full`}>
                  {getRoleBadge(profile.role)}
                </span>
              </div>
              
              <div className="text-gray-600 mb-3">
                <p className="text-lg">{profile.location || 'Location not specified'}</p>
                <p className="text-sm">Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>

              <p className="text-gray-700 mb-4 max-w-2xl">
                {profile.bio || `${getRoleDisplay(profile.role)} with experience in coastal safety and community protection. Dedicated to keeping our communities safe through early hazard detection and community education.`}
              </p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-lg font-semibold">4.9</span>
                  <span className="text-gray-600">(47 reviews)</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {getRoleDisplay(profile.role)}
                </span>
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  Community Leader
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button 
              onClick={loadProfileData}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <button 
              onClick={handleEditProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Profile</span>
          </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {profile.role === 'analyst' ? (
          <>
            {/* Analyst-specific stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.verifiedReports || 0}</p>
                  <p className="text-sm text-gray-600">Reports Verified</p>
                  <p className="text-xs text-green-600 mt-1">{stats?.accuracy || 0}% accuracy rate</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">2.3h</p>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-xs text-blue-600 mt-1">Industry leading</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-600">Analyses Completed</p>
                  <p className="text-xs text-purple-600 mt-1">This month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                  <p className="text-sm text-gray-600">Expert Rating</p>
                  <p className="text-xs text-yellow-600 mt-1">Top 2% analyst</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* User-specific stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalReports || 0}</p>
              <p className="text-sm text-gray-600">Reports Submitted</p>
              <p className="text-xs text-green-600 mt-1">+{stats?.thisMonthReports || 0} this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.verifiedReports || 0}</p>
              <p className="text-sm text-gray-600">Reports Verified</p>
              <p className="text-xs text-green-600 mt-1">{stats?.accuracy || 0}% accuracy</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">4.9</p>
              <p className="text-sm text-gray-600">Community Rating</p>
              <p className="text-xs text-blue-600 mt-1">Top 5% contributor</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.profileViews || 0}</p>
              <p className="text-sm text-gray-600">Profile Views</p>
              <p className="text-xs text-green-600 mt-1">+{stats?.weeklyViews || 0} this week</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {profile.role === 'analyst' ? (
              // Analyst-specific tabs
              ['overview', 'analyses', 'verifications', 'insights', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))
            ) : (
              // User-specific tabs
              ['overview', 'my-reports', 'achievements', 'community', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
              ))
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {profile.role === 'analyst' ? 'Recent Analyses' : 'Recent Activity'}
                </h3>
                <div className="space-y-4">
                  {reports.length > 0 ? (
                    reports.slice(0, 3).map((report) => {
                      const getStatusColor = (status) => {
                        switch (status) {
                          case 'verified': return 'bg-green-100 text-green-800'
                          case 'rejected': return 'bg-red-100 text-red-800'
                          case 'in_review': return 'bg-yellow-100 text-yellow-800'
                          default: return 'bg-gray-100 text-gray-800'
                        }
                      }
                      
                      const getEventIcon = (eventType) => {
                        const iconMap = {
                          'high_waves': 'M13 10V3L4 14h7v7l9-11h-7z',
                          'storm_surge': 'M13 10V3L4 14h7v7l9-11h-7z',
                          'coastal_erosion': 'M13 10V3L4 14h7v7l9-11h-7z',
                          'flooding': 'M13 10V3L4 14h7v7l9-11h-7z'
                        }
                        return iconMap[eventType] || 'M13 10V3L4 14h7v7l9-11h-7z'
                      }
                      
                      const getEventColor = (eventType) => {
                        const colorMap = {
                          'high_waves': 'bg-blue-100 text-blue-600',
                          'storm_surge': 'bg-red-100 text-red-600',
                          'coastal_erosion': 'bg-orange-100 text-orange-600',
                          'flooding': 'bg-purple-100 text-purple-600'
                        }
                        return colorMap[eventType] || 'bg-gray-100 text-gray-600'
                      }
                      
                      const formatDate = (dateString) => {
                        const date = new Date(dateString)
                        const now = new Date()
                        const diffTime = Math.abs(now - date)
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                        
                        if (diffDays === 1) return '1 day ago'
                        if (diffDays < 7) return `${diffDays} days ago`
                        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
                        return date.toLocaleDateString()
                      }
                      
                      return (
                        <div key={report.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-10 h-10 ${getEventColor(report.event_type).split(' ')[0]} rounded-lg flex items-center justify-center`}>
                            <svg className={`w-5 h-5 ${getEventColor(report.event_type).split(' ')[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getEventIcon(report.event_type)} />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 capitalize">
                                {report.event_type.replace('_', ' ')}
                              </h4>
                              <span className={`${getStatusColor(report.status)} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                                {report.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {report.location_name || 'Location not specified'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(report.created_at)}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-sm text-gray-600">12</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-sm text-gray-600">5</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reports submitted yet</p>
                      <button 
                        onClick={() => navigate('/report')}
                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Submit your first report
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {profile.role === 'analyst' ? (
                    <>
                      <button 
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 flex items-center space-x-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Analytics Dashboard</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('verifications')}
                        className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Verify Reports</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('insights')}
                        className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate Insights</span>
                      </button>
                    </>
                  ) : (
                    <>
                  <button 
                    onClick={() => navigate('/report')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Submit New Report</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>View Dashboard</span>
                  </button>
                  
                      <button 
                        onClick={() => setActiveTab('community')}
                        className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center space-x-3"
                      >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Community Forums</span>
                  </button>
                    </>
                  )}
                  
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Profile Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User-specific tabs */}
          {activeTab === 'my-reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">My Reports</h3>
                <button 
                  onClick={() => navigate('/report')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Submit New Report</span>
                </button>
              </div>
              
              <div className="grid gap-4">
                {reports.length > 0 ? (
                  reports.map((report) => {
                    const getStatusColor = (status) => {
                      switch (status) {
                        case 'verified': return 'bg-green-100 text-green-800'
                        case 'rejected': return 'bg-red-100 text-red-800'
                        case 'in_review': return 'bg-yellow-100 text-yellow-800'
                        default: return 'bg-gray-100 text-gray-800'
                      }
                    }
                    
                    return (
                      <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-gray-900 capitalize">
                                {report.event_type?.replace('_', ' ')}
                              </h4>
                              <span className={`${getStatusColor(report.status)} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                                {report.status?.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {report.description || 'No description provided'}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>📍 {report.location_name || 'Location not specified'}</span>
                              <span>📅 {new Date(report.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
            <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No reports submitted yet</p>
                    <button 
                      onClick={() => navigate('/report')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Submit your first report
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Achievements & Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🏆</span>
                    <h4 className="font-semibold">First Report</h4>
                  </div>
                  <p className="text-sm opacity-90">Submitted your first hazard report</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-400 to-blue-500 text-white p-6 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">✅</span>
                    <h4 className="font-semibold">Verified Reporter</h4>
                  </div>
                  <p className="text-sm opacity-90">Had 5+ reports verified by analysts</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 text-white p-6 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🌟</span>
                    <h4 className="font-semibold">Community Helper</h4>
                  </div>
                  <p className="text-sm opacity-90">Active community contributor</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Community Activity</h3>
              <div className="grid gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Recent Community Posts</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="text-gray-700">"Great to see the new reporting features! This will help keep our community safer."</p>
                      <p className="text-sm text-gray-500 mt-1">2 days ago • 12 likes</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="text-gray-700">"Thanks to the analysts for verifying my report so quickly. The system works!"</p>
                      <p className="text-sm text-gray-500 mt-1">1 week ago • 8 likes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analyst-specific tabs */}
          {activeTab === 'analyses' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Analyses</h3>
              <div className="grid gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">Coastal Erosion Pattern Analysis</h4>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Analyzed 47 reports from Chennai coast showing increasing erosion trends</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>📊 47 reports analyzed</span>
                    <span>📅 2 days ago</span>
                    <span>⏱️ 3.2 hours</span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">Storm Surge Prediction Model</h4>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      In Progress
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Developing ML model for early storm surge detection</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>🤖 ML Model</span>
                    <span>📅 Started 1 week ago</span>
                    <span>⏱️ 12.5 hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verifications' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Report Verifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-green-700">Verified Today</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">23</div>
                  <div className="text-sm text-yellow-700">Pending Review</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">2.3h</div>
                  <div className="text-sm text-blue-700">Avg Response Time</div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Recent Verifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">High Wave Report - Mumbai</p>
                      <p className="text-sm text-gray-600">Verified as accurate</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Oil Spill Report - Kochi</p>
                      <p className="text-sm text-gray-600">Requires additional evidence</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Data Insights & Trends</h3>
              <div className="grid gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Insights This Week</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• 23% increase in coastal erosion reports from Chennai region</li>
                    <li>• Storm surge reports up 15% compared to last month</li>
                    <li>• 89% accuracy rate in user-submitted reports</li>
                    <li>• Peak reporting time: 2-4 PM daily</li>
                  </ul>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Trending Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {['coastal erosion', 'high waves', 'storm surge', 'oil spill', 'flooding'].map((keyword, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Profile Settings</h3>
              <div className="grid gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input 
                        type="text" 
                        value={editing ? editForm.name : profile.name}
                        onChange={editing ? (e) => setEditForm(prev => ({ ...prev, name: e.target.value })) : undefined}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input 
                        type="text" 
                        value={editing ? editForm.location : (profile.location || '')}
                        onChange={editing ? (e) => setEditForm(prev => ({ ...prev, location: e.target.value })) : undefined}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input 
                        type="text" 
                        value={editing ? editForm.phone : (profile.phone || '')}
                        onChange={editing ? (e) => setEditForm(prev => ({ ...prev, phone: e.target.value })) : undefined}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea 
                        rows={3}
                        value={editing ? editForm.bio : (profile.bio || '')}
                        onChange={editing ? (e) => setEditForm(prev => ({ ...prev, bio: e.target.value })) : undefined}
                        disabled={!editing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                  
                  {editing ? (
                    <div className="mt-4 flex space-x-3">
                      <button 
                        onClick={handleSaveProfile}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleEditProfile}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Profile Picture</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {profile.profile_pic ? (
                        <img 
                          src={profile.profile_pic} 
                          alt={profile.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(profile.name)
                      )}
                    </div>
                    <div>
                      <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        {uploading ? 'Uploading...' : 'Change Picture'}
                      </label>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Notification Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-sm text-gray-700">Email notifications for new reports</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      <span className="text-sm text-gray-700">Weekly analytics summary</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-sm text-gray-700">Community updates</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
