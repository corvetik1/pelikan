import { render, screen } from '@testing-library/react';
import StoreMap from '../StoreMap';
import { stores } from '@/data/stores';

// Mock react-leaflet primitives for JSDOM
jest.mock('react-leaflet', () => {
  return {
    MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
    TileLayer: () => null,
    Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('StoreMap', () => {
  it('renders marker for each store', () => {
    render(<StoreMap stores={stores} />);

    const markers = screen.getAllByTestId('marker');
    expect(markers.length).toBe(stores.length);
  });
});
