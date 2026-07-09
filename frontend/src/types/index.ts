export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Room {
  id: string;
  name: string;
  pricePerNight: number;
  description: string;
  amenities: string[];
  maxOccupancy: number;
  type: 'single' | 'double' | 'family' | 'suite' | 'apartment';
  visualUrl?: string;
  isPopular?: boolean;
  isTopChoice?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
