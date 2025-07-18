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

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  weight: string;
  category: string;
  img?: string;
  createdAt: string; // ISO
}

export interface AdminRecipe {
  id: string;
  title: string;
  category: string;
  cookingTime: number;
  shortDescription: string;
  img?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string; // ISO
}
