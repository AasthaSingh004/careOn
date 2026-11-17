import React, { useState } from 'react';

export default function EmergencyList({
  emergencies,
  onStatusChange,
  onDelete,
  loading,
}) {
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = emergencies.filter((item) => {
    if (statusFilter === 'All') return true;
    return item.status === statusFilter;
  });

  return (
    <div className="panel" style={{ flex: 1 }}>
      <div className="panel-title">
        <span>📋 Emergency Board ({filtered.length})</span>
      </div>

      <div className="filter-bar">
        {['All', 'Pending', 'Responded', 'Resolved'].map((tab) => (
          <button
            key={tab}
            className={`filter-btn ${statusFilter === tab ? 'active' : ''}`}
            onClick={() => setStatusFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && emergencies.length === 0 ? (
        <div className="empty-state">Loading active emergencies...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No incidents match the selected filter.</div>
      ) : (
        <div className="emergency-list">
          {filtered.map((item) => (
            <div key={item.id} className="emergency-item">
              <div className="item-main">
                <div className="item-header">
                  <span className="patient-name">{item.patient_name}</span>
                  <span className="room-badge">{item.room_number}</span>
                  <span className={`badge priority-${item.priority}`}>
                    {item.priority}
                  </span>
                  <span className={`badge status-${item.status}`}>
                    {item.status}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    [{item.emergency_type}]
                  </span>
                </div>

                {item.description && (
                  <p className="item-desc">{item.description}</p>
                )}

                <div className="item-meta">
                  Alert ID #{item.id} • Registered:{' '}
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              <div className="item-actions">
                <select
                  className="status-select"
                  value={item.status}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  aria-label={`Status for ${item.patient_name}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Responded">Responded</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <button
                  className="btn-delete"
                  onClick={() => onDelete(item.id)}
                  title="Remove Incident Record"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
