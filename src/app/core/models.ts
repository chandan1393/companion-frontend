
export interface ApiResponse<T> { success: boolean; message?: string | null; data: T; }

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface User {
  id: number; fullName: string; email: string; phone?: string | null;
  city?: string | null; role: string; status: string;
}

export interface Companion {
  id: number; userId?: number; displayName: string; age: number; city: string; gender: string;
  bio?: string | null; tagline?: string | null; coverPhotoUrl?: string | null;
  status: string; hourlyRate: number; rating: number; reviewCount: number;
  completedBookings: number; profileCompletion: number; interests: string[];
  photoUrls: string[];
}

export interface Experience {
  id: number; companionId: number; companionName: string; title: string;
  description: string; price: number; durationMinutes: number;
  category?: string | null; imageUrl?: string | null; active: boolean;
}

export interface Availability {
  id: number; date: string; startTime: string; endTime: string; status: string;
}

export interface Booking {
  id: number; customerId: number; customerName: string; companionId: number;
  companionName: string; experienceId: number; experienceTitle: string;
  bookingDate: string; startTime: string; endTime: string; baseAmount: number;
  platformFee: number; totalAmount: number; location: string;
  status: string; customerNote?: string | null;
}

export interface Review {
  id: number; bookingId: number; companionId: number; customerName: string;
  rating: number; comment: string; createdAt: string;
}

export interface Message {
  id: number; senderId: number; senderName: string; recipientId: number;
  recipientName: string; content: string; createdAt: string; readAt?: string | null;
}

export interface Payment {
  id: number; bookingId: number; amount: number; providerOrderId?: string | null;
  providerPaymentId?: string | null; status: string;
}

export interface DashboardData { [key: string]: any; }
