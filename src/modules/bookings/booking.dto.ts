/**
 * Data Transfer Objects (DTOs) for Booking API
 * Separate from DB model to decouple API from database
 */

export interface CreateBookingDTO {
  customerName: string;
  customerEmail: string;
  customerPhoneNumber?: string;
  numberOfGuests?: number;
  children?: number;
  pets?: number;
  specialRequests?: string;
  pickupLocation?: {
    address?: string;
    city?: string;
    country?: string;
    zipCode?: string;
  };
  destination?: {
    address?: string;
    city?: string;
    country?: string;
    zipCode?: string;
  };
  serviceTitle: string;
  amount: number;
  currency?: "USD" | "KES";
  costAtBooking?: number;
  costPostEvent?: number;
  agentId?: string;
  serviceStartAt?: Date;
  serviceEndAt?: Date;
  serviceTimezone?: string;
  splitPaymentEnabled?: boolean;
  depositPercentage?: number;
  depositAmount?: number;
  depositDueDate?: Date;
  balanceDueDate?: Date;
  splitPaymentNotes?: string;
}

export interface UpdateBookingDTO {
  customerName?: string;
  customerEmail?: string;
  customerPhoneNumber?: string;
  numberOfGuests?: number;
  children?: number;
  pets?: number;
  specialRequests?: string;
  pickupLocation?: Record<string, any>;
  destination?: Record<string, any>;
  serviceTitle?: string;
  amount?: number;
  currency?: "USD" | "KES";
  costAtBooking?: number;
  costPostEvent?: number;
  serviceStartAt?: Date;
  serviceEndAt?: Date;
  serviceTimezone?: string;
  status?: string;
  paymentStatus?: string;
}

export interface BookingResponseDTO {
  id: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  serviceTitle: string;
  amount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}
