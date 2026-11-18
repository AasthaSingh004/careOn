import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

export default function LeafletMap({
  incidents = [],
  resources = [],
  providers = [],
  center = [12.3052, 76.6552], // Default: Mysuru, Karnataka, India
  zoom = 13,
  isSimulationActive = false,
  onMarkerSelect,
  selectable = false,
  selectedLocation = null,
  onLocationSelect,
  height = '420px',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const incidentsLayerRef = useRef(null);
  const resourcesLayerRef = useRef(null);
  const providersLayerRef = useRef(null);
  const selectionMarkerRef = useRef(null);

  const [activeSimulationStep, setActiveSimulationStep] = useState(0);
  const [tileErrorNotice, setTileErrorNotice] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Initialize Map ONCE on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent duplicate instantiation

    try {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      mapInstanceRef.current = map;

      // Standard OpenStreetMap Tile Layer
      const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        crossOrigin: true,
      }).addTo(map);

      // Automatic seamless tile fallback if OpenStreetMap server rate-limits or fails
      osmTileLayer.on('tileerror', (error) => {
        if (error.coords && error.tile) {
          const s = ['a', 'b', 'c', 'd'][Math.abs(error.coords.x + error.coords.y) % 4];
          const fallbackUrl = `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/${error.coords.z}/${error.coords.x}/${error.coords.y}.png`;
          if (error.tile.src !== fallbackUrl) {
            error.tile.src = fallbackUrl;
          }
        }
      });

      // Layer groups for markers
      incidentsLayerRef.current = L.layerGroup().addTo(map);
      resourcesLayerRef.current = L.layerGroup().addTo(map);
      providersLayerRef.current = L.layerGroup().addTo(map);

      // Invalidate size on container resize (handles tab switching without map breakage)
      const resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);

      // Delay invalidateSize to ensure correct initial container calculation
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setMapReady(true);
        }
      }, 200);

      // Map click handler for location selection mode
      if (selectable) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          if (onLocationSelect) {
            onLocationSelect({
              latitude: Number(lat.toFixed(6)),
              longitude: Number(lng.toFixed(6)),
              location_name: `Mysuru Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            });
          }
        });
      }

      return () => {
        resizeObserver.disconnect();
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.warn('Leaflet map initialization warning:', err);
      setTileErrorNotice(true);
    }
  }, [selectable]); // only run once (or when selectable mode toggles)

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

  // Update Center if changed
  useEffect(() => {
    if (mapInstanceRef.current && center && Array.isArray(center) && center.length === 2) {
      mapInstanceRef.current.setView(center, mapInstanceRef.current.getZoom());
    }
  }, [center]);

  // Update Selection Marker in Selectable Mode
  useEffect(() => {
    if (!mapInstanceRef.current || !selectable) return;

    if (selectionMarkerRef.current) {
      selectionMarkerRef.current.remove();
      selectionMarkerRef.current = null;
    }

    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      const lat = selectedLocation.latitude;
      const lng = selectedLocation.longitude;

      const pinIcon = L.divIcon({
        className: 'careon-selection-pin',
        html: `
          <div style="
            background: #e11d48;
            color: #ffffff;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          ">
            <div style="transform: rotate(45deg); font-size: 14px; font-weight: 800;">📍</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([lat, lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(mapInstanceRef.current);

      marker.bindPopup(`<strong>Selected Emergency Location</strong><br/>${selectedLocation.location_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}`).openPopup();

      marker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        if (onLocationSelect) {
          onLocationSelect({
            latitude: Number(pos.lat.toFixed(6)),
            longitude: Number(pos.lng.toFixed(6)),
            location_name: `Selected: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`,
          });
        }
      });

      selectionMarkerRef.current = marker;
      mapInstanceRef.current.panTo([lat, lng]);
    }
  }, [selectedLocation, selectable, onLocationSelect]);

  // Update Incidents Markers (WITHOUT destroying the map instance!)
  useEffect(() => {
    if (!incidentsLayerRef.current) return;
    incidentsLayerRef.current.clearLayers();

    incidents.forEach((inc) => {
      if (!inc.latitude || !inc.longitude) return;

      const isCritical = inc.priority === 'Critical';
      const color = isCritical ? '#e11d48' : inc.priority === 'High' ? '#f59e0b' : '#0284c7';
      const pulseClass = isCritical ? 'pulse-marker' : '';

      const iconHtml = `
        <div class="${pulseClass}" style="
          background-color: ${color};
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 0 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
        ">
          !
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'careon-incident-pin',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 1.4; min-width: 180px;">
          <div style="font-weight: 800; color: ${color}; font-size: 13px; margin-bottom: 2px;">
            🚨 ${inc.category} (${inc.priority} Priority)
          </div>
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">
            ${inc.incident_code}
          </div>
          <div style="color: #475569; font-size: 12px; margin-bottom: 4px;">
            📍 ${inc.location_name || 'Mysuru Region'}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px; margin-top: 4px;">
            <span>Status: <b>${inc.status}</b></span>
            <span>People: <b>${inc.affected_people || 1}</b></span>
          </div>
        </div>
      `);

      marker.on('click', () => onMarkerSelect?.({ type: 'incident', item: inc }));
      incidentsLayerRef.current.addLayer(marker);
    });
  }, [incidents, onMarkerSelect]);

  // Update Resources Markers (WITHOUT destroying the map instance!)
  useEffect(() => {
    if (!resourcesLayerRef.current) return;
    resourcesLayerRef.current.clearLayers();

    resources.forEach((res) => {
      if (!res.latitude || !res.longitude) return;

      let lat = res.latitude;
      let lon = res.longitude;

      // Animate assigned fleet gently during simulation
      if (isSimulationActive && res.status === 'Assigned') {
        lat += activeSimulationStep * 0.0006;
        lon -= activeSimulationStep * 0.0006;
      }

      const isAvail = res.status === 'Available';
      const isAssigned = res.status === 'Assigned';
      const color = isAvail ? '#10b981' : isAssigned ? '#2563eb' : '#64748b';
      const symbol = res.category?.includes('Fire') ? '🔥' : res.category?.includes('Rescue') ? '🦺' : '🚑';

      const iconHtml = `
        <div style="
          background-color: ${color};
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        ">
          ${symbol}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'careon-resource-pin',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([lat, lon], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 1.4; min-width: 180px;">
          <div style="font-weight: 800; color: ${color}; font-size: 13px; margin-bottom: 2px;">
            ${symbol} ${res.name}
          </div>
          <div style="font-size: 12px; color: #334155;">
            Code: <b>${res.resource_code}</b> (${res.category})
          </div>
          <div style="font-size: 12px; color: #475569;">
            Base: ${res.location_name || 'Mysuru Station'}
          </div>
          <div style="margin-top: 4px; font-size: 11px; font-weight: 700; color: ${color};">
            Status: ${res.status}
          </div>
        </div>
      `);

      marker.on('click', () => onMarkerSelect?.({ type: 'resource', item: res }));
      resourcesLayerRef.current.addLayer(marker);
    });
  }, [resources, isSimulationActive, activeSimulationStep, onMarkerSelect]);

  // Update External Providers Markers
  useEffect(() => {
    if (!providersLayerRef.current) return;
    providersLayerRef.current.clearLayers();

    providers.forEach((prov) => {
      if (!prov.latitude || !prov.longitude) return;

      const iconHtml = `
        <div style="
          background-color: #8b5cf6;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
        ">
          🏥
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'careon-provider-pin',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([prov.latitude, prov.longitude], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 1.4;">
          <strong style="color: #7c3aed;">🏥 ${prov.name}</strong><br/>
          Type: <b>${prov.provider_type}</b> (${prov.is_registered_partner ? 'Vetted Partner' : 'Directory'})<br/>
          Location: ${prov.address || 'Mysuru'}<br/>
          Base Quote: ₹${prov.estimated_base_charge || 1200}
        </div>
      `);

      providersLayerRef.current.addLayer(marker);
    });
  }, [providers]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Simulation Movement Banner */}
      {isSimulationActive && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1000,
            backgroundColor: 'rgba(15, 76, 92, 0.95)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
          <span>Vehicle Movement Active (Step {activeSimulationStep + 1}/10)</span>
        </div>
      )}

      {/* Selectable Location Banner */}
      {selectable && (
        <div
          style={{
            background: '#f0fdfa',
            border: '1px solid #99f6e4',
            padding: '6px 12px',
            borderRadius: '8px 8px 0 0',
            fontSize: '12px',
            fontWeight: 600,
            color: '#0f766e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>📍 Click or drag pin to select exact emergency location in Mysuru</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Center: Mysuru, Karnataka</span>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          height: height,
          width: '100%',
          borderRadius: selectable ? '0 0 10px 10px' : '10px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          backgroundColor: '#e2e8f0', // placeholder background while tiles load
          zIndex: 1,
        }}
      />

      {/* Map Legend */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          marginTop: '10px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#475569',
          flexWrap: 'wrap',
          alignItems: 'center',
          background: '#f8fafc',
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#e11d48' }} />
          Emergency Incidents
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#10b981' }} />
          Available Fleet
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#2563eb' }} />
          Dispatched Units
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
          Partner Hospitals & NGOs
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#64748b' }}>
          Mysuru City Region (12.3052° N, 76.6552° E)
        </span>
      </div>
    </div>
  );
}
