import React, { useState } from 'react';

export default function EmergencyForm({ onSubmit, loading }) {
  const [patientName, setPatientName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [emergencyType, setEmergencyType] = useState('Cardiac');
  const [priority, setPriority] = useState('Critical');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!patientName.trim()) {
      setError('Patient name is required');
      return;
    }
    if (!roomNumber.trim()) {
      setError('Room/Bed number is required');
      return;
    }

    try {
      await onSubmit({
        patient_name: patientName.trim(),
        room_number: roomNumber.trim(),
        emergency_type: emergencyType,
        priority: priority,
        description: description.trim() || undefined,
      });
      // Clear form on success
      setPatientName('');
      setRoomNumber('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to dispatch emergency');
    }
  };

  return (
    <div className="panel">
      <h2 className="panel-title">
        <span>🚨 Dispatch Emergency Alert</span>
      </h2>

      {error && (
        <div
          role="alert"
          style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="patient-name">Patient Full Name *</label>
          <input
            id="patient-name"
            className="form-input"
            type="text"
            placeholder="e.g. John Doe"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="room-number">Hospital Room / Bed # *</label>
          <input
            id="room-number"
            className="form-input"
            type="text"
            placeholder="e.g. ICU-302, ER-Bay-2"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="emergency-type">Emergency Category</label>
          <select
            id="emergency-type"
            className="form-select"
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
            disabled={loading}
          >
            <option value="Cardiac">Cardiac Emergency</option>
            <option value="Respiratory">Respiratory Distress</option>
            <option value="Trauma">Trauma / Code Yellow</option>
            <option value="Neurological">Neurological / Stroke</option>
            <option value="General">General Medical Alert</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="priority-level">Triage Priority</label>
          <select
            id="priority-level"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
          >
            <option value="Critical">🔴 Critical (Immediate Action)</option>
            <option value="High">🟠 High Priority (&lt; 10 mins)</option>
            <option value="Medium">🟡 Medium Priority</option>
            <option value="Low">🟢 Low Priority</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Clinical Notes &amp; Observations</label>
          <textarea
            id="description"
            className="form-textarea"
            rows={3}
            placeholder="Vitals, symptoms, immediate equipment needed..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn-dispatch"
          disabled={loading}
        >
          {loading ? 'Dispatching...' : '⚡ Broadcast Code Alert'}
        </button>
      </form>
    </div>
  );
}
