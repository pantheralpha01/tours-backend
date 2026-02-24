import { randomUUID } from "crypto";
import { Currency, OfferStatus, Prisma } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { offerRepository } from "./offer.repository";
import { calculateOfferPrice, OfferPricingInput } from "./offer.pricing";
import { OFFER_BASE_FEE_RATE, OFFER_DEFAULT_CURRENCY } from "./offer.constants";
import { bookingRepository } from "../bookings/booking.repository";
import { offerAssetService } from "./offer.assets";
import { offerContractService } from "./offer.contract";
import { prisma } from "../../config/prisma";
import { config } from "../../config";

const sanitizeAddons = (addons?: Array<{ label: string; amount: number }>) =>
  (addons ?? []).filter((addon) => addon.amount > 0);

const sanitizeItinerary = (
  itinerary?: Array<Record<string, unknown>>
): Array<Record<string, unknown>> | undefined =>
  itinerary && itinerary.length > 0 ? itinerary : undefined;

const decimalToNumber = (value: Prisma.Decimal | number): number =>
  typeof value === "number" ? value : value.toNumber();

const createShareSlug = () => randomUUID().replace(/-/g, "").slice(0, 12);

const buildShareUrl = (slug?: string) => {
  if (!slug) {
    return undefined;
  }
  if (!config.offer.publicBaseUrl) {
    return undefined;
  }
  return `${config.offer.publicBaseUrl.replace(/\/$/, "")}/${slug}`;
};

export const offerService = {
  createTemplate: async (data: {
    name: string;
    slug: string;
    description?: string;
    defaultCurrency?: Currency;
    baseAmount?: number;
    feePercentage?: number;
    itinerary?: Array<Record<string, unknown>>;
    addons?: Array<{ label: string; amount: number }>;
    metadata?: Record<string, unknown>;
    actorId?: string;
  }) =>
    offerRepository.createTemplate({
      name: data.name,
      slug: data.slug,
      description: data.description,
      defaultCurrency: data.defaultCurrency ?? OFFER_DEFAULT_CURRENCY,
      baseAmount: data.baseAmount,
      feePercentage: data.feePercentage ?? OFFER_BASE_FEE_RATE,
      itinerary: data.itinerary as any,
      addons: sanitizeAddons(data.addons) as any,
      metadata: data.metadata as any,
      createdBy: data.actorId ? { connect: { id: data.actorId } } : undefined,
    }),

  listTemplates: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      offerRepository.listTemplates({ skip, take: limit, search: params?.search }),
      offerRepository.countTemplates({ search: params?.search }),
    ]);

    return { data, meta: calculatePagination(total, page, limit) };
  },

  getTemplateById: (id: string) => offerRepository.findTemplateById(id),

  calculatePrice: (input: OfferPricingInput) => calculateOfferPrice(input),

  createProposal: async (data: {
    bookingId: string;
    templateId?: string;
    baseAmount: number;
    addons?: Array<{ label: string; amount: number }>;
    currency?: Currency;
    itinerary?: Array<Record<string, unknown>>;
    notes?: string;
    metadata?: Record<string, unknown>;
    expiresAt?: Date;
    discountRateOverride?: number;
  }) => {
    const booking = await bookingRepository.findById(data.bookingId);
    if (!booking) {
      throw ApiError.notFound("Booking not found");
    }

    let template = null;
    if (data.templateId) {
      template = await offerRepository.findTemplateById(data.templateId);
      if (!template) {
        throw ApiError.notFound("Offer template not found");
      }
    }

    const addons = sanitizeAddons(data.addons ?? (template?.addons as any));
    const itinerary = sanitizeItinerary(data.itinerary ?? (template?.itinerary as any));

    const pricing = calculateOfferPrice({
      baseAmount: data.baseAmount,
      addons,
      currency: data.currency ?? template?.defaultCurrency ?? (booking.currency as Currency),
      discountRateOverride: data.discountRateOverride,
    });

    const proposal = await offerRepository.createProposal({
      booking: { connect: { id: data.bookingId } },
      template: template ? { connect: { id: template.id } } : undefined,
      currency: pricing.currency,
      baseAmount: pricing.baseAmount,
      feeAmount: pricing.fee.amount,
      discountAmount: pricing.discount.amount,
      totalAmount: pricing.total,
      feePercentage: pricing.feePercentage,
      discountRate: pricing.discountRate,
      itinerary: itinerary as any,
      priceBreakdown: {
        baseAmount: pricing.baseAmount,
        addons,
        addonsTotal: pricing.addonsTotal,
        subtotal: pricing.subtotal,
        fee: pricing.fee,
        discount: pricing.discount,
        total: pricing.total,
      } as any,
      notes: data.notes,
      metadata: data.metadata as any,
      expiresAt: data.expiresAt,
    });

    return proposal;
  },

  listProposals: async (params?: {
    page?: number;
    limit?: number;
    status?: OfferStatus;
    bookingId?: string;
    search?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      offerRepository.listProposals({
        skip,
        take: limit,
        status: params?.status,
        bookingId: params?.bookingId,
        search: params?.search,
      }),
      offerRepository.countProposals({
        status: params?.status,
        bookingId: params?.bookingId,
        search: params?.search,
      }),
    ]);

    return { data, meta: calculatePagination(total, page, limit) };
  },

  getProposalById: async (id: string) => {
    const proposal = await offerRepository.findProposalById(id);
    if (!proposal) {
      throw ApiError.notFound("Offer proposal not found");
    }
    return proposal;
  },

  generateAssetsForProposal: async (id: string, options?: { logo?: boolean; signature?: boolean }) => {
    const proposal = await offerRepository.findProposalById(id);
    if (!proposal) {
      throw ApiError.notFound("Offer proposal not found");
    }

    const logoPromise = options?.logo !== false ? offerAssetService.generateLogo() : null;
    const signaturePromise = options?.signature !== false ? offerAssetService.generateSignature() : null;

    const [logo, signature] = await Promise.all([logoPromise, signaturePromise]);

    const updates: Record<string, unknown> = {};

    if (logo) {
      updates.logoUrl = logo.url;
      await prisma.offerAsset.create({
        data: {
          proposal: { connect: { id: proposal.id } },
          type: "LOGO",
          url: logo.url,
          metadata: logo.metadata as any,
        },
      });
    }

    if (signature) {
      updates.signatureUrl = signature.url;
      await prisma.offerAsset.create({
        data: {
          proposal: { connect: { id: proposal.id } },
          type: "SIGNATURE",
          url: signature.url,
          metadata: signature.metadata as any,
        },
      });
    }

    if (Object.keys(updates).length > 0) {
      await prisma.offerProposal.update({ where: { id: proposal.id }, data: updates });
    }

    return offerRepository.findProposalById(id);
  },

  generateContract: async (id: string) => {
    const proposal = await offerRepository.findProposalById(id);
    if (!proposal) {
      throw ApiError.notFound("Offer proposal not found");
    }

    if (!proposal.booking) {
      throw ApiError.badRequest("Offer proposal missing booking context");
    }

    const contract = await offerContractService.generate({
      bookingId: proposal.bookingId,
      customerName: proposal.booking.customerName,
      serviceTitle: proposal.booking.serviceTitle,
      itinerary: proposal.itinerary as any,
      priceBreakdown: proposal.priceBreakdown as any,
      notes: proposal.notes,
      logoUrl: proposal.logoUrl,
      signatureUrl: proposal.signatureUrl,
    });

    await prisma.offerProposal.update({
      where: { id: proposal.id },
      data: { pdfUrl: contract.url },
    });

    return { ...proposal, pdfUrl: contract.url };
  },

  approveProposal: async (
    id: string,
    options: {
      actorId?: string;
      notes?: string;
    }
  ) => {
    const proposal = await offerRepository.findProposalById(id);
    if (!proposal) {
      throw ApiError.notFound("Offer proposal not found");
    }

    if (proposal.status !== OfferStatus.DRAFT) {
      throw ApiError.badRequest("Only draft proposals can be approved");
    }

    await prisma.offerProposal.update({
      where: { id: proposal.id },
      data: {
        status: OfferStatus.APPROVED,
        approvedAt: new Date(),
        approvalNotes: options.notes ?? null,
        approvedBy: options.actorId ? { connect: { id: options.actorId } } : undefined,
      },
    });

    return offerRepository.findProposalById(id);
  },

  publishProposal: async (
    id: string,
    options: {
      actorId?: string;
      channel?: string;
      notes?: string;
    }
  ) => {
    const proposal = await offerRepository.findProposalById(id);
    if (!proposal) {
      throw ApiError.notFound("Offer proposal not found");
    }

    if (proposal.status !== OfferStatus.APPROVED) {
      throw ApiError.badRequest("Only approved proposals can be published");
    }

    const shareSlug = proposal.shareSlug ?? createShareSlug();
    const shareUrl = buildShareUrl(shareSlug) ?? proposal.shareUrl ?? undefined;

    await prisma.offerProposal.update({
      where: { id: proposal.id },
      data: {
        status: OfferStatus.SENT,
        publishedAt: new Date(),
        publishedChannel: options.channel,
        publishNotes: options.notes ?? null,
        shareSlug,
        shareUrl,
        publishedBy: options.actorId ? { connect: { id: options.actorId } } : undefined,
      },
    });

    return offerRepository.findProposalById(id);
  },

  createProposalFromBooking: async (
    bookingId: string,
    options?: {
      templateId?: string;
      notes?: string;
      metadata?: Record<string, unknown>;
      expiresAt?: Date;
      discountRateOverride?: number;
    }
  ) => {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      throw ApiError.notFound("Booking not found for offer proposal");
    }

    const baseAmount = decimalToNumber(booking.amount as Prisma.Decimal);
    if (baseAmount <= 0) {
      throw ApiError.badRequest("Booking amount must be greater than zero");
    }

    return offerService.createProposal({
      bookingId,
      templateId: options?.templateId,
      baseAmount,
      currency: booking.currency as Currency,
      notes: options?.notes,
      metadata: options?.metadata,
      expiresAt: options?.expiresAt,
      discountRateOverride: options?.discountRateOverride,
    });
  },

  ensureProposalForBooking: async (
    bookingId: string,
    options?: {
      templateId?: string;
      notes?: string;
      metadata?: Record<string, unknown>;
      expiresAt?: Date;
      discountRateOverride?: number;
    }
  ) => {
    const existing = await offerRepository.findLatestProposalForBooking(bookingId);
    if (existing) {
      return existing;
    }

    return offerService.createProposalFromBooking(bookingId, options);
  },
};
