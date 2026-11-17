const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch statistics');
  return res.json();
}

export async function fetchEmergencies(status = '', priority = '') {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);

  const url = `${API_BASE}/emergencies${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch emergencies');
  return res.json();
}

export async function createEmergency(data) {
  const res = await fetch(`${API_BASE}/emergencies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail?.[0]?.msg || errorData.detail || 'Failed to dispatch emergency');
  }
  return res.json();
}

export async function updateEmergencyStatus(id, newStatus) {
  const res = await fetch(`${API_BASE}/emergencies/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function deleteEmergency(id) {
  const res = await fetch(`${API_BASE}/emergencies/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete emergency');
  return true;
}
