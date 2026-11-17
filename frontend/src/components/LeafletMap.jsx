import React, { useEffect, useRef, useState } from 'react';

export default function LeafletMap({
  incidents = [],
  resources = [],
  providers = [],
  center = [12.9716, 77.5946],
  zoom = 12,
  isSimulationActive = false,
  onMarkerSelect,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState(false);
  const [activeSimulationStep, setActiveSimulationStep] = useState(0);

  // Simulation timer for movement
  useEffect(() => {
    let interval = null;
    if (isSimulationActive) {
      interval = setInterval(() => {
        setActiveSimulationStep((prev) => (prev + 1) % 10);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSimulationActive]);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        if (!mapContainerRef.current) return;

        // Dynamically import leaflet to gracefully handle environments without window/DOM or network
        const L = (await import('leaflet')).default;

        // Leaflet CSS check / inject if missing
        if (!document.getElementById('leaflet-css-bundle')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css-bundle';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        const map = L.map(mapContainerRef.current).setView(center, zoom);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Clear previous markers
        markersRef.current = [];

        // 1. Incidents (Red marker for Critical/High)
        incidents.forEach((inc) => {
          if (!inc.latitude || !inc.longitude) return;

          const color = inc.priority === 'Critical' ? '#ef4444' : inc.priority === 'High' ? '#f59e0b' : '#3b82f6';
          const iconHtml = `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>`;
          const customIcon = L.divIcon({ html: iconHtml, className: 'careon-custom-pin', iconSize: [18, 18] });

          const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 13px;">
              <strong style="color: ${color};">🚨 ${inc.category} (${inc.priority})</strong><br/>
              <b>${inc.incident_code}</b>: ${inc.location_name}<br/>
              Status: <i>${inc.status}</i><br/>
              Affected: ${inc.affected_people} people
            </div>
          `);
          marker.on('click', () => onMarkerSelect?.({ type: 'incident', item: inc }));
          markersRef.current.push(marker);
        });

        // 2. Resources (Green for available, Blue for dispatched/assigned)
        resources.forEach((res) => {
          if (!res.latitude || !res.longitude) return;

          let lat = res.latitude;
          let lon = res.longitude;

          // If simulation is active and resource is dispatched, animate coordinate slightly towards center
          if (isSimulationActive && res.status === 'Assigned') {
            lat += (activeSimulationStep * 0.001);
            lon -= (activeSimulationStep * 0.001);
          }

          const color = res.status === 'Available' ? '#10b981' : res.status === 'Assigned' ? '#2563eb' : '#64748b';
          const iconHtml = `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 4px; border: 2px solid #ffffff; box-shadow: 0 0 6px rgba(0,0,0,0.3);"></div>`;
          const customIcon = L.divIcon({ html: iconHtml, className: 'careon-res-pin', iconSize: [16, 16] });

          const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 13px;">
              <strong style="color: ${color};">🚑 ${res.name}</strong><br/>
              Code: ${res.resource_code} (${res.category})<br/>
              Status: <b>${res.status}</b><br/>
              Base: ${res.location_name}
            </div>
          `);
          marker.on('click', () => onMarkerSelect?.({ type: 'resource', item: res }));
          markersRef.current.push(marker);
        });

        // 3. External Providers (Purple pins)
        providers.forEach((prov) => {
          if (!prov.latitude || !prov.longitude) return;
          const iconHtml = `<div style="background-color: #8b5cf6; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`;
          const customIcon = L.divIcon({ html: iconHtml, className: 'careon-prov-pin', iconSize: [14, 14] });

          const marker = L.marker([prov.latitude, prov.longitude], { icon: customIcon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 13px;">
              <strong style="color: #7c3aed;">🏥 ${prov.name}</strong><br/>
              Type: ${prov.provider_type} (${prov.is_registered_partner ? 'Partner' : 'Directory'})<br/>
              Base Quote: ₹${prov.estimated_base_charge}
            </div>
          `);
          markersRef.current.push(marker);
        });

      } catch (err) {
        if (isMounted) {
          console.warn('Leaflet map initialization fallback triggered:', err);
          setMapError(true);
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [incidents, resources, providers, activeSimulationStep, isSimulationActive]);

  if (mapError) {
    // Offline / Network Fallback Table
    return (
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '12px', fontWeight: 700, fontSize: '14px' }}>
          <span>⚠️</span>
          <span>Map Tiles Offline / Offline Coordinate Fallback Mode</span>
        </div>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          OpenStreetMap tiles are currently unreachable or offline. CareOn is maintaining full coordinate tracking below:
        </p>

        <div className="table-wrapper">
          <table className="careon-table">
            <thead>
              <tr>
                <th>Entity Code</th>
                <th>Type / Category</th>
                <th>Location Area</th>
                <th>Coordinates (Lat, Lon)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={`inc-${inc.id}`}>
                  <td><strong>{inc.incident_code}</strong></td>
                  <td>{inc.category}</td>
                  <td>{inc.location_name}</td>
                  <td>{inc.latitude.toFixed(4)}, {inc.longitude.toFixed(4)}</td>
                  <td><span className="status-badge badge-critical">{inc.status}</span></td>
                </tr>
              ))}
              {resources.map((res) => (
                <tr key={`res-${res.id}`}>
                  <td><strong>{res.resource_code}</strong></td>
                  <td>{res.category}</td>
                  <td>{res.location_name}</td>
                  <td>{res.latitude.toFixed(4)}, {res.longitude.toFixed(4)}</td>
                  <td><span className="status-badge badge-dispatched">{res.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {isSimulationActive && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1000,
            backgroundColor: 'rgba(15, 76, 92, 0.9)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
          Simulated Vehicle Movement In Progress (Step {activeSimulationStep + 1}/10)
        </div>
      )}
      <div
        ref={mapContainerRef}
        style={{
          height: '420px',
          width: '100%',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      />
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '10px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#475569',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          Emergency Incidents
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: '#10b981' }} />
          Available Resources
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: '#2563eb' }} />
          Assigned / Dispatched Fleet
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
          External Partner Providers
        </span>
      </div>
    </div>
  );
}
