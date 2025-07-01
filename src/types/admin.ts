export interface AdminNews {
  id: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  category: string;
}

export interface AdminStore {
  id: string;
  name: string;
  address: string;
  region: string;
  lat: number;
  lng: number;
  isActive: boolean;
}
