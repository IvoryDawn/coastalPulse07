import { useState } from 'react'
import { register } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [profilePic, setProfilePic] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('role', role)
      formData.append('location', location)
      formData.append('phone', phone)
      formData.append('bio', bio)
      if (profilePic) {
        formData.append('profile_pic', profilePic)
      }
      
      await register(formData)
      navigate('/login')
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="max-w-lg mx-auto card p-6 rounded-2xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Your Account</h2>

      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full border rounded-xl p-2"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <select
          className="w-full border rounded-xl p-2"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="citizen">Citizen</option>
          <option value="officer">Officer</option>
          <option value="analyst">Analyst</option>
        </select>

        <input
          className="w-full border rounded-xl p-2"
          placeholder="Location (City, State)"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-2"
          placeholder="Phone Number"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <textarea
          className="w-full border rounded-xl p-2"
          placeholder="Short Bio (200 characters)"
          maxLength={200}
          rows={3}
          value={bio}
          onChange={e => setBio(e.target.value)}
        />

        <input
          className="w-full border rounded-xl p-2"
          placeholder="Profile Picture (optional)"
          type="file"
          accept="image/*"
          onChange={e => setProfilePic(e.target.files[0])}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          className="w-full bg-[linear-gradient(to_right,#062647,#0A5276,#1B8D98)] text-white rounded-xl py-2 font-semibold hover:bg-[linear-gradient(to_right,#0A3044,#0D638A,#22A1B2)]"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
 }

