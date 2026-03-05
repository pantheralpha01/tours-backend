/**
 * Booking Mapper
 * Transforms DTOs to Prisma models and handles all type conversions
 */

import { Prisma } from "@prisma/client";
import { CreateBookingDTO, UpdateBookingDTO } from "./booking.dto";

/**
 * Calculate commission based on amount and rate
 */
const calculateCommission = (amount: number, rate: number = 0.15): number => {
  return parseFloat((amount * rate).toFixed(2));
};

/**
 * Convert USD to KES (approximate rate)
 */
const convertUsdToKes = (usdAmount: number, rate: number = 150): number => {
  return parseFloat((usdAmount * rate).toFixed(2));
};

/**
 * Map CreateBookingDTO to Prisma create input
 * Handles type conversions, commission calculations, and JSON serialization
 */
export const mapCreateDTOToDb = (
  dto: CreateBookingDTO & { agentId: string }
): any => {
  // Convert amount to Decimal for safe database storage
  const amount = new Prisma.Decimal(dto.amount || 0);

  // Auto-calculate commission at 15%
  const commissionRate = new Prisma.Decimal(0.15); // 15%
  const commissionAmount = new Prisma.Decimal(
    calculateCommission(dto.amount || 0, 0.15)
  );

  // Convert commission to KES if needed
  const commissionInKes = new Prisma.Decimal(
    convertUsdToKes(commissionAmount.toNumber(), 150)
  );

  // Handle optional deposit/balance amounts
  let depositAmount: Prisma.Decimal | null = null;
  let balanceAmount: Prisma.Decimal | null = null;

  if (dto.depositAmount !== undefined && dto.depositAmount !== null) {
    depositAmount = new Prisma.Decimal(dto.depositAmount);
    balanceAmount = new Prisma.Decimal(
      (dto.totalAmount || dto.amount || 0) - (dto.depositAmount || 0)
    );
  }

  return {
    bookingReference: generateBookingReference(),
    customerName: dto.customerName,
    customerEmail: dto.customerEmail,
    customerPhoneNumber: dto.customerPhoneNumber || null,
    numberOfGuests: dto.numberOfGuests || 1,
    children: dto.children || 0,
    pets: dto.pets || 0,
    specialRequests: dto.specialRequests || null,

    // Location details - serialize to JSON
    pickupLocation: dto.pickupLocation
      ? JSON.stringify(dto.pickupLocation)
      : null,
    destination: dto.destination ? JSON.stringify(dto.destination) : null,

    serviceTitle: dto.serviceTitle,
    amount,
    currency: dto.currency || "USD",
    commissionRate,
    commissionAmount: commissionInKes,
    commissionCurrency: "KES",
    status: "DRAFT",
    paymentStatus: "UNPAID",
    paymentType: dto.paymentType || "FULL_PAYMENT",

    costAtBooking: dto.costAtBooking
      ? new Prisma.Decimal(dto.costAtBooking)
      : null,
    costPostEvent: dto.costPostEvent
      ? new Prisma.Decimal(dto.costPostEvent)
      : null,
    totalCost: dto.totalCost ? new Prisma.Decimal(dto.totalCost) : null,

    depositPercentage: dto.depositPercentage
      ? new Prisma.Decimal(dto.depositPercentage)
      : null,
    depositAmount,
    balanceAmount,
    splitPaymentEnabled: dto.splitPaymentEnabled || false,
    splitPaymentNotes: dto.splitPaymentNotes || null,

    serviceStartAt: dto.serviceStartAt ? new Date(dto.serviceStartAt) : null,
    serviceEndAt: dto.serviceEndAt ? new Date(dto.serviceEndAt) : null,
    serviceTimezone: dto.serviceTimezone || null,
    payPostEventDueDate: dto.payPostEventDueDate
      ? new Date(dto.payPostEventDueDate)
      : null,
    depositDueDate: dto.depositDueDate ? new Date(dto.depositDueDate) : null,
    balanceDueDate: dto.balanceDueDate ? new Date(dto.balanceDueDate) : null,
    
    agentId: dto.agentId,
  };
};

/**
 * Map UpdateBookingDTO to Prisma update input
 * Only updates provided fields
 */
export const mapUpdateDTOToDb = (
  dto: UpdateBookingDTO
): Prisma.BookingUpdateInput => {
  const updateData: Prisma.BookingUpdateInput = {};

  // Only include fields that are provided
  if (dto.customerName !== undefined) {
    updateData.customerName = dto.customerName;
  }

  if (dto.customerEmail !== undefined) {
    updateData.customerEmail = dto.customerEmail;
  }

  if (dto.customerPhoneNumber !== undefined) {
    updateData.customerPhoneNumber = dto.customerPhoneNumber;
  }

  if (dto.numberOfGuests !== undefined) {
    updateData.numberOfGuests = dto.numberOfGuests;
  }

  if (dto.children !== undefined) {
    updateData.children = dto.children;
  }

  if (dto.pets !== undefined) {
    updateData.pets = dto.pets;
  }

  if (dto.specialRequests !== undefined) {
    updateData.specialRequests = dto.specialRequests;
  }

  if (dto.pickupLocation !== undefined) {
    updateData.pickupLocation = dto.pickupLocation
      ? JSON.stringify(dto.pickupLocation)
      : null;
  }

  if (dto.destination !== undefined) {
    updateData.destination = dto.destination
      ? JSON.stringify(dto.destination)
      : null;
  }

  if (dto.serviceTitle !== undefined) {
    updateData.serviceTitle = dto.serviceTitle;
  }

  if (dto.amount !== undefined) {
    updateData.amount = new Prisma.Decimal(dto.amount);
  }

  if (dto.currency !== undefined) {
    updateData.currency = dto.currency;
  }

  if (dto.costAtBooking !== undefined) {
    updateData.costAtBooking = dto.costAtBooking
      ? new Prisma.Decimal(dto.costAtBooking)
      : null;
  }

  if (dto.costPostEvent !== undefined) {
    updateData.costPostEvent = dto.costPostEvent
      ? new Prisma.Decimal(dto.costPostEvent)
      : null;
  }

  if (dto.totalCost !== undefined) {
    updateData.totalCost = dto.totalCost
      ? new Prisma.Decimal(dto.totalCost)
      : null;
  }

  if (dto.depositPercentage !== undefined) {
    updateData.depositPercentage = dto.depositPercentage
      ? new Prisma.Decimal(dto.depositPercentage)
      : null;
  }

  if (dto.depositAmount !== undefined) {
    updateData.depositAmount = dto.depositAmount
      ? new Prisma.Decimal(dto.depositAmount)
      : null;
  }

  if (dto.balanceAmount !== undefined) {
    updateData.balanceAmount = dto.balanceAmount
      ? new Prisma.Decimal(dto.balanceAmount)
      : null;
  }

  if (dto.splitPaymentEnabled !== undefined) {
    updateData.splitPaymentEnabled = dto.splitPaymentEnabled;
  }

  if (dto.splitPaymentNotes !== undefined) {
    updateData.splitPaymentNotes = dto.splitPaymentNotes;
  }

  if (dto.serviceStartAt !== undefined) {
    updateData.serviceStartAt = dto.serviceStartAt
      ? new Date(dto.serviceStartAt)
      : null;
  }

  if (dto.serviceEndAt !== undefined) {
    updateData.serviceEndAt = dto.serviceEndAt
      ? new Date(dto.serviceEndAt)
      : null;
  }

  if (dto.serviceTimezone !== undefined) {
    updateData.serviceTimezone = dto.serviceTimezone;
  }

  if (dto.payPostEventDueDate !== undefined) {
    updateData.payPostEventDueDate = dto.payPostEventDueDate
      ? new Date(dto.payPostEventDueDate)
      : null;
  }

  if (dto.depositDueDate !== undefined) {
    updateData.depositDueDate = dto.depositDueDate
      ? new Date(dto.depositDueDate)
      : null;
  }

  if (dto.balanceDueDate !== undefined) {
    updateData.balanceDueDate = dto.balanceDueDate
      ? new Date(dto.balanceDueDate)
      : null;
  }

  return updateData;
};

/**
 * Generate unique booking reference
 * Format: BK-2026-00001
 */
const generateBookingReference = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `BK-${year}-${random}`;
};
