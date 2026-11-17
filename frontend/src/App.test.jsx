import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import EmergencyForm from './components/EmergencyForm';
import EmergencyList from './components/EmergencyList';

describe('Header component', () => {
  it('renders application title and system status', () => {
    const health = { status: 'healthy', version: '1.0.0' };
    render(<Header health={health} onRefresh={() => {}} />);

    expect(screen.getByText('CareOn')).toBeInTheDocument();
    expect(screen.getByText(/Hospital Emergency Response/i)).toBeInTheDocument();
    expect(screen.getByText(/System Online/i)).toBeInTheDocument();
  });
});

describe('StatsCards component', () => {
  it('renders all key emergency response metrics', () => {
    const stats = {
      total: 12,
      critical: 4,
      pending: 3,
      responded: 5,
      resolved: 2,
    };
    render(<StatsCards stats={stats} />);

    expect(screen.getByText(/Total Incidents/i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/Critical Triage/i)).toBeInTheDocument();
  });
});

describe('EmergencyForm component', () => {
  it('captures input fields and triggers dispatch callback', async () => {
    const handleSubmit = vi.fn().mockResolvedValue({ id: 10, patient_name: 'Jane Foster', room_number: 'Bed-4B' });
    render(<EmergencyForm onSubmit={handleSubmit} loading={false} />);

    const nameInput = screen.getByLabelText(/Patient Full Name/i);
    const roomInput = screen.getByLabelText(/Hospital Room/i);
    const submitBtn = screen.getByRole('button', { name: /Broadcast Code Alert/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Foster' } });
    fireEvent.change(roomInput, { target: { value: 'Bed-4B' } });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        patient_name: 'Jane Foster',
        room_number: 'Bed-4B',
      })
    );
  });
});

describe('EmergencyList component', () => {
  it('renders list of emergencies and filters by status', () => {
    const sampleEmergencies = [
      {
        id: 1,
        patient_name: 'Alice Springs',
        room_number: 'ER-01',
        emergency_type: 'Cardiac',
        priority: 'Critical',
        status: 'Pending',
        description: 'V-Tach reported',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        patient_name: 'Bob Marley',
        room_number: 'Ward-2',
        emergency_type: 'Trauma',
        priority: 'High',
        status: 'Resolved',
        description: 'Fracture set',
        created_at: new Date().toISOString(),
      },
    ];

    render(
      <EmergencyList
        emergencies={sampleEmergencies}
        onStatusChange={() => {}}
        onDelete={() => {}}
        loading={false}
      />
    );

    expect(screen.getByText('Alice Springs')).toBeInTheDocument();
    expect(screen.getByText('Bob Marley')).toBeInTheDocument();

    // Filter to Pending only
    const pendingFilterBtn = screen.getByRole('button', { name: 'Pending' });
    fireEvent.click(pendingFilterBtn);

    expect(screen.getByText('Alice Springs')).toBeInTheDocument();
    expect(screen.queryByText('Bob Marley')).not.toBeInTheDocument();
  });
});
