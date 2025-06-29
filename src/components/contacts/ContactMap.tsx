'use client';

import '@/utils/leaflet';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box } from '@mui/material';
import { MAP_HEIGHT } from '@/constants';
import 'leaflet/dist/leaflet.css';
import type { CompanyInfo } from '@/data/company';



interface ContactMapProps {
  company: CompanyInfo;
}

export default function ContactMap({ company }: ContactMapProps) {
  const position: [number, number] = [company.lat, company.lng];

  return (
    <Box sx={{ height: MAP_HEIGHT, width: '100%', mt: 4 }}>
      <MapContainer center={position} zoom={14} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>{company.address}</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
