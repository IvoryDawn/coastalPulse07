import { useState } from 'react'
import { login } from '../api/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    setError(null)
    try {
      console.log('Attempting login with:', { email, password })
      const res = await login({ email, password })
      console.log('Login response:', res)
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      console.log('User stored in localStorage:', res.user)
      navigate('/dashboard')
    } catch (e) {
      console.error('Login error:', e)
      setError(e.response?.data?.message || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-2">Login</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full border rounded-2xl p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-2xl p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-[linear-gradient(to_right,#062647,#0A5276,#1B8D98)] text-white rounded-xl py-2 font-semibold hover:bg-[linear-gradient(to_right,#0A3044,#0D638A,#22A1B2)]">Login</button>
      </form>
      <p className="text-sm mt-2">No account? <Link className="link" to="/register">Register</Link></p>
    </div>
  )
}
