export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  type: string;
  status: string;
  images: string | string[] | unknown;
  image?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: any;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  phone?: string;
  address?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  propertyId?: string;
  sender?: User;
  receiver?: User;
}

export interface SavedProperty {
  id: string;
  createdAt: Date;
  userId: string;
  propertyId: string;
}
