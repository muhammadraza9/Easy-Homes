export interface Property {
  id: string;

  title: string;
  description: string;

  price: number;
  location: string;

  latitude: number;
  longitude: number;

  bedrooms: number;
  bathrooms: number;
  area: number;

  type: string;
  status: string;

  // ONLY THIS (NO "image")
  images: string | string[];

  featured: boolean;

  createdAt: Date;
  updatedAt: Date;

  userId: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    phone?: string | null;
  };
}