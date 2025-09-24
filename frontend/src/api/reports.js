import client, { API_BASE } from './client'


export async function listReports(user, token, params = {}) {
  let url;
  const role = user.role?.toLowerCase();

  if (role === 'citizen') {
    url = `/reports/user/${user.id}`;
  } else if (role === 'officer') {
    url = `/reports`;
  } else if (role === 'analyst') {
    url = `/reports`;
  } else {
    throw new Error(`Unsupported role: ${user.role}`);
  }

  const { data } = await client.get(url, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });

  return data;
}

export async function submitReport(formData, token) {
  const res = await fetch(API_BASE + '/api/reports', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  return res.json();
}




export async function verifyReport(id, status, token) {
  const { data } = await client.patch(`/reports/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function getMetrics(token) {
  const { data } = await client.get('/admin/metrics', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}
