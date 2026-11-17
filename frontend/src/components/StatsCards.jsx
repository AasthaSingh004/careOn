import React from 'react';

export default function StatsCards({ stats }) {
  const items = [
    { label: 'Total Incidents', value: stats.total ?? 0, className: 'total' },
    { label: 'Critical Triage', value: stats.critical ?? 0, className: 'critical' },
    { label: 'Pending Response', value: stats.pending ?? 0, className: 'pending' },
    { label: 'En Route / Responded', value: stats.responded ?? 0, className: 'responded' },
    { label: 'Resolved', value: stats.resolved ?? 0, className: 'resolved' },
  ];

  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div key={item.label} className={`stat-card ${item.className}`}>
          <span className="stat-label">{item.label}</span>
          <span className="stat-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
