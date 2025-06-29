import { render, screen } from '@testing-library/react';
import ContactMap from '../ContactMap';
import { company } from '@/data/company';

jest.mock('react-leaflet', () => {
  return {
    MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
    TileLayer: () => null,
    Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('ContactMap', () => {
  it('renders single marker for company address', () => {
    render(<ContactMap company={company} />);

    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(1);
    expect(markers[0]).toHaveTextContent(company.address);
  });
});
