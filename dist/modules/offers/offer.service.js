"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerService = void 0;
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const ApiError_1 = require("../../utils/ApiError");
const pagination_1 = require("../../utils/pagination");
const offer_repository_1 = require("./offer.repository");
const offer_pricing_1 = require("./offer.pricing");
const offer_constants_1 = require("./offer.constants");
const booking_repository_1 = require("../bookings/booking.repository");
const offer_assets_1 = require("./offer.assets");
const offer_contract_1 = require("./offer.contract");
const prisma_1 = require("../../config/prisma");
const config_1 = require("../../config");
const sanitizeAddons = (addons) => (addons ?? []).filter((addon) => addon.amount > 0);
const sanitizeItinerary = (itinerary) => itinerary && itinerary.length > 0 ? itinerary : undefined;
const decimalToNumber = (value) => typeof value === "number" ? value : value.toNumber();
const createShareSlug = () => (0, crypto_1.randomUUID)().replace(/-/g, "").slice(0, 12);
const buildShareUrl = (slug) => {
    if (!slug) {
        return undefined;
    }
    if (!config_1.config.offer.publicBaseUrl) {
        return undefined;
    }
    return `${config_1.config.offer.publicBaseUrl.replace(/\/$/, "")}/${slug}`;
};
exports.offerService = {
    createTemplate: async (data) => offer_repository_1.offerRepository.createTemplate({
        name: data.name,
        slug: data.slug,
        description: data.description,
        defaultCurrency: data.defaultCurrency ?? offer_constants_1.OFFER_DEFAULT_CURRENCY,
        baseAmount: data.baseAmount,
        feePercentage: data.feePercentage ?? offer_constants_1.OFFER_BASE_FEE_RATE,
        itinerary: data.itinerary,
        addons: sanitizeAddons(data.addons),
        metadata: data.metadata,
        createdBy: data.actorId ? { connect: { id: data.actorId } } : undefined,
    }),
    listTemplates: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            offer_repository_1.offerRepository.listTemplates({ skip, take: limit, search: params?.search }),
            offer_repository_1.offerRepository.countTemplates({ search: params?.search }),
        ]);
        return { data, meta: (0, pagination_1.calculatePagination)(total, page, limit) };
    },
    getTemplateById: (id) => offer_repository_1.offerRepository.findTemplateById(id),
    calculatePrice: (input) => (0, offer_pricing_1.calculateOfferPrice)(input),
    createProposal: async (data) => {
        const booking = await booking_repository_1.bookingRepository.findById(data.bookingId);
        if (!booking) {
            throw ApiError_1.ApiError.notFound("Booking not found");
        }
        let template = null;
        if (data.templateId) {
            template = await offer_repository_1.offerRepository.findTemplateById(data.templateId);
            if (!template) {
                throw ApiError_1.ApiError.notFound("Offer template not found");
            }
        }
        const addons = sanitizeAddons(data.addons ?? template?.addons);
        const itinerary = sanitizeItinerary(data.itinerary ?? template?.itinerary);
        const pricing = (0, offer_pricing_1.calculateOfferPrice)({
            baseAmount: data.baseAmount,
            addons,
            currency: data.currency ?? template?.defaultCurrency ?? booking.currency,
            discountRateOverride: data.discountRateOverride,
        });
        const proposal = await offer_repository_1.offerRepository.createProposal({
            booking: { connect: { id: data.bookingId } },
            template: template ? { connect: { id: template.id } } : undefined,
            currency: pricing.currency,
            baseAmount: pricing.baseAmount,
            feeAmount: pricing.fee.amount,
            discountAmount: pricing.discount.amount,
            totalAmount: pricing.total,
            feePercentage: pricing.feePercentage,
            discountRate: pricing.discountRate,
            itinerary: itinerary,
            priceBreakdown: {
                baseAmount: pricing.baseAmount,
                addons,
                addonsTotal: pricing.addonsTotal,
                subtotal: pricing.subtotal,
                fee: pricing.fee,
                discount: pricing.discount,
                total: pricing.total,
            },
            notes: data.notes,
            metadata: data.metadata,
            expiresAt: data.expiresAt,
        });
        return proposal;
    },
    listProposals: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            offer_repository_1.offerRepository.listProposals({
                skip,
                take: limit,
                status: params?.status,
                bookingId: params?.bookingId,
                search: params?.search,
            }),
            offer_repository_1.offerRepository.countProposals({
                status: params?.status,
                bookingId: params?.bookingId,
                search: params?.search,
            }),
        ]);
        return { data, meta: (0, pagination_1.calculatePagination)(total, page, limit) };
    },
    getProposalById: async (id) => {
        const proposal = await offer_repository_1.offerRepository.findProposalById(id);
        if (!proposal) {
            throw ApiError_1.ApiError.notFound("Offer proposal not found");
        }
        return proposal;
    },
    generateAssetsForProposal: async (id, options) => {
        const proposal = await offer_repository_1.offerRepository.findProposalById(id);
        if (!proposal) {
            throw ApiError_1.ApiError.notFound("Offer proposal not found");
        }
        const logoPromise = options?.logo !== false ? offer_assets_1.offerAssetService.generateLogo() : null;
        const signaturePromise = options?.signature !== false ? offer_assets_1.offerAssetService.generateSignature() : null;
        const [logo, signature] = await Promise.all([logoPromise, signaturePromise]);
        const updates = {};
        if (logo) {
            updates.logoUrl = logo.url;
            await prisma_1.prisma.offerAsset.create({
                data: {
                    proposal: { connect: { id: proposal.id } },
                    type: "LOGO",
                    url: logo.url,
                    metadata: logo.metadata,
                },
            });
        }
        if (signature) {
            updates.signatureUrl = signature.url;
            await prisma_1.prisma.offerAsset.create({
                data: {
                    proposal: { connect: { id: proposal.id } },
                    type: "SIGNATURE",
                    url: signature.url,
                    metadata: signature.metadata,
                },
            });
        }
        if (Object.keys(updates).length > 0) {
            await prisma_1.prisma.offerProposal.update({ where: { id: proposal.id }, data: updates });
        }
        return offer_repository_1.offerRepository.findProposalById(id);
    },
    generateContract: async (id) => {
        const proposal = await offer_repository_1.offerRepository.findProposalById(id);
        if (!proposal) {
            throw ApiError_1.ApiError.notFound("Offer proposal not found");
        }
        if (!proposal.booking) {
            throw ApiError_1.ApiError.badRequest("Offer proposal missing booking context");
        }
        const contract = await offer_contract_1.offerContractService.generate({
            bookingId: proposal.bookingId,
            customerName: proposal.booking.customerName,
            serviceTitle: proposal.booking.serviceTitle,
            itinerary: proposal.itinerary,
            priceBreakdown: proposal.priceBreakdown,
            notes: proposal.notes,
            logoUrl: proposal.logoUrl,
            signatureUrl: proposal.signatureUrl,
        });
        await prisma_1.prisma.offerProposal.update({
            where: { id: proposal.id },
            data: { pdfUrl: contract.url },
        });
        return { ...proposal, pdfUrl: contract.url };
    },
    approveProposal: async (id, options) => {
        const proposal = await offer_repository_1.offerRepository.findProposalById(id);
        if (!proposal) {
            throw ApiError_1.ApiError.notFound("Offer proposal not found");
        }
        if (proposal.status !== client_1.OfferStatus.DRAFT) {
            throw ApiError_1.ApiError.badRequest("Only draft proposals can be approved");
        }
        await prisma_1.prisma.offerProposal.update({
            where: { id: proposal.id },
            data: {
                status: client_1.OfferStatus.APPROVED,
                approvedAt: new Date(),
                approvalNotes: options.notes ?? null,
                approvedBy: options.actorId ? { connect: { id: options.actorId } } : undefined,
            },
        });
        return offer_repository_1.offerRepository.findProposalById(id);
    },
    publishProposal: async (id, options) => {
        const proposal = await offer_repository_1.offerRepository.findProposalById(id);
        if (!proposal) {
            throw ApiError_1.ApiError.notFound("Offer proposal not found");
        }
        if (proposal.status !== client_1.OfferStatus.APPROVED) {
            throw ApiError_1.ApiError.badRequest("Only approved proposals can be published");
        }
        const shareSlug = proposal.shareSlug ?? createShareSlug();
        const shareUrl = buildShareUrl(shareSlug) ?? proposal.shareUrl ?? undefined;
        await prisma_1.prisma.offerProposal.update({
            where: { id: proposal.id },
            data: {
                status: client_1.OfferStatus.SENT,
                publishedAt: new Date(),
                publishedChannel: options.channel,
                publishNotes: options.notes ?? null,
                shareSlug,
                shareUrl,
                publishedBy: options.actorId ? { connect: { id: options.actorId } } : undefined,
            },
        });
        return offer_repository_1.offerRepository.findProposalById(id);
    },
    createProposalFromBooking: async (bookingId, options) => {
        const booking = await booking_repository_1.bookingRepository.findById(bookingId);
        if (!booking) {
            throw ApiError_1.ApiError.notFound("Booking not found for offer proposal");
        }
        const baseAmount = decimalToNumber(booking.amount);
        if (baseAmount <= 0) {
            throw ApiError_1.ApiError.badRequest("Booking amount must be greater than zero");
        }
        return exports.offerService.createProposal({
            bookingId,
            templateId: options?.templateId,
            baseAmount,
            currency: booking.currency,
            notes: options?.notes,
            metadata: options?.metadata,
            expiresAt: options?.expiresAt,
            discountRateOverride: options?.discountRateOverride,
        });
    },
    ensureProposalForBooking: async (bookingId, options) => {
        const existing = await offer_repository_1.offerRepository.findLatestProposalForBooking(bookingId);
        if (existing) {
            return existing;
        }
        return exports.offerService.createProposalFromBooking(bookingId, options);
    },
};
//# sourceMappingURL=offer.service.js.map