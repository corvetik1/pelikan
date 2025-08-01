'use client';

import React from 'react';
import '@/utils/leaflet';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import EditableField from '@/components/admin/EditableField';
import EditableParagraph from '@/components/admin/EditableParagraph';
import { useUpdateStoreFieldMutation } from '@/redux/adminApi';
import { MAP_HEIGHT } from '@/constants';
import type { Store } from '@/data/stores';
import { Box } from '@mui/material';
import 'leaflet/dist/leaflet.css';

interface StoreMapProps {
  stores: Store[];
  center?: [number, number];
  zoom?: number;
}

export default function StoreMap(props: StoreMapProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <StoreMapInner {...props} />;
}

function StoreMapInner({ stores, center, zoom = 5 }: StoreMapProps) {
  const mapKey = Math.random().toString(36).slice(2);
  const [updateStoreField] = useUpdateStoreFieldMutation();
  const mapCenter: [number, number] = center ?? [55.751244, 37.618423];

  React.useEffect(() => {
    return () => {
      const container = document.querySelector(`.leaflet-container`);
      if (container && (container as unknown as { _leaflet_id?: number })._leaflet_id) {
        delete (container as unknown as { _leaflet_id?: number })._leaflet_id;
      }
    };
  }, []);

  return (
    <Box sx={{ height: MAP_HEIGHT, width: '100%' }}>
      <MapContainer key={mapKey}
                center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stores.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]}>
            <Popup>
              <EditableField
                value={s.name}
                onSave={(newName) => updateStoreField({ id: s.id, patch: { name: newName } })}
                typographyProps={{ component: 'strong', variant: 'subtitle1' }}
              />
              <EditableParagraph
                value={s.address}
                onSave={(newAddr) => updateStoreField({ id: s.id, patch: { address: newAddr } })}
                typographyProps={{ variant: 'body2' }}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
    </Box>
  );
}
