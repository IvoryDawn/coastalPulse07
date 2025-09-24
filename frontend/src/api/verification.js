import client from './client'

// Analyst APIs
export async function getPendingReportsForAnalyst() {
  const token = localStorage.getItem('token')
  
  try {
    const { data } = await client.get('/verification/analyst/pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return data
  } catch (error) {
    console.error('Error fetching reports:', error)
    throw error
  }
}

export async function verifyReportAsAnalyst(reportId, verified, notes) {
  const token = localStorage.getItem('token')
  
  console.log('🔍 Verifying report as analyst:', {
    reportId,
    verified,
    notes,
    tokenExists: !!token
  });
  
  try {
    const { data } = await client.post(`/verification/analyst/verify/${reportId}`, {
      verified,
      notes
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Verification successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Verification failed:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

// Officer APIs
export async function getPendingReportsForOfficer() {
  const token = localStorage.getItem('token')
  const { data } = await client.get('/verification/officer/pending', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return data
}

export async function verifyReportAsOfficer(reportId, verified, notes, generateAlert = false, alertData = {}) {
  const token = localStorage.getItem('token')
  const { data } = await client.post(`/verification/officer/verify/${reportId}`, {
    verified,
    notes,
    generateAlert,
    ...alertData
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return data
}

// General APIs
export async function getAllAlerts() {
  const token = localStorage.getItem('token')
  const { data } = await client.get('/verification/alerts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return data
}

export async function getUserNotifications() {
  const token = localStorage.getItem('token')
  const { data } = await client.get('/verification/notifications', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return data
}

export async function markNotificationAsRead(notificationId) {
  const token = localStorage.getItem('token')
  const { data } = await client.put(`/verification/notifications/${notificationId}/read`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  return data
}
