import client from './client'

export async function register(payload) {
  const { data } = await client.post('/auth/register', payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export async function login(payload) {
  const { data } = await client.post('/auth/login', payload)
  return data
}

export async function getProfile() {
  const token = localStorage.getItem('token')
  const { data } = await client.get('/profile/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return data
}

export async function uploadProfilePicture(file) {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('profilePicture', file)
  
  const { data } = await client.post('/profile/upload-picture', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export async function updateProfile(profileData) {
  const token = localStorage.getItem('token')
  const { data } = await client.put('/profile/update', profileData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return data
}
