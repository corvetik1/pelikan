'use client';

import '@/utils/leaflet';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MAP_HEIGHT } from '@/constants';
import type { Store } from '@/data/stores';
import { Box } from '@mui/material';
import 'leaflet/dist/leaflet.css';

interface StoreMapProps {
  stores: Store[];
  center?: [number, number];
  zoom?: number;
}

export default function StoreMap({ stores, center, zoom = 5 }: StoreMapProps) {
  const mapCenter: [number, number] = center ?? [55.751244, 37.618423]; // default Moscow

  return (
    <Box sx={{ height: MAP_HEIGHT, width: '100%' }}>
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stores.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]}>
            <Popup>
              <strong>{s.name}</strong>
              <br />
              {s.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
