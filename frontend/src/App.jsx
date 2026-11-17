import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import EmergencyForm from './components/EmergencyForm';
import EmergencyList from './components/EmergencyList';
import {
  fetchHealth,
  fetchStats,
  fetchEmergencies,
  createEmergency,
  updateEmergencyStatus,
  deleteEmergency,
} from './api';
import './App.css';

export default function App() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, responded: 0, resolved: 0, critical: 0 });
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      const [healthData, statsData, items] = await Promise.all([
        fetchHealth().catch(() => ({ status: 'degraded' })),
        fetchStats().catch(() => ({ total: 0, pending: 0, responded: 0, resolved: 0, critical: 0 })),
        fetchEmergencies().catch(() => []),
      ]);
      setHealth(healthData);
      setStats(statsData);
      setEmergencies(items);
    } catch (err) {
      console.error('Error fetching CareOn data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // 10s auto refresh
    return () => clearInterval(interval);
  }, [loadData]);

  const handleDispatch = async (payload) => {
    setFormSubmitting(true);
    try {
      const created = await createEmergency(payload);
      showNotification(`Alert #${created.id} broadcast for ${created.patient_name} in ${created.room_number}`);
      await loadData();
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateEmergencyStatus(id, status);
      await loadData();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this emergency record?')) {
      return;
    }
    try {
      await deleteEmergency(id);
      await loadData();
    } catch (err) {
      alert(`Failed to delete record: ${err.message}`);
    }
  };

  return (
    <div>
      <Header health={health} onRefresh={loadData} />

      <main className="container">
        {notification && (
          <div
            style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              color: '#15803d',
              padding: '12px 18px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            ✓ {notification}
          </div>
        )}

        <StatsCards stats={stats} />

        <div className="main-layout">
          <EmergencyForm onSubmit={handleDispatch} loading={formSubmitting} />
          <EmergencyList
            emergencies={emergencies}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
