"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerInviteService = void 0;
const node_crypto_1 = require("node:crypto");
const config_1 = require("../../config");
const ApiError_1 = require("../../utils/ApiError");
const pagination_1 = require("../../utils/pagination");
const partner_invite_repository_1 = require("./partner-invite.repository");
const partner_repository_1 = require("../partners/partner.repository");
const partner_event_repository_1 = require("../partners/partner-event.repository");
const DEFAULT_EXPIRY_DAYS = 14;
exports.partnerInviteService = {
    create: async (data) => {
        const existingPartner = data.email
            ? await partner_repository_1.partnerRepository.findByEmail(data.email)
            : null;
        if (existingPartner && existingPartner.approvalStatus === "APPROVED") {
            throw ApiError_1.ApiError.badRequest("Partner already approved for this email");
        }
        const pendingInvite = await partner_invite_repository_1.partnerInviteRepository.findActiveByEmail(data.email);
        if (pendingInvite) {
            throw ApiError_1.ApiError.badRequest("An active invite already exists for this email");
        }
        const partner = existingPartner ??
            (await partner_repository_1.partnerRepository.create({
                name: data.companyName,
                email: data.email,
                isActive: false,
                createdById: data.invitedById,
            }));
        const token = (0, node_crypto_1.randomUUID)();
        const expiresAt = addDays(new Date(), data.expiresInDays ?? DEFAULT_EXPIRY_DAYS);
        const invite = await partner_invite_repository_1.partnerInviteRepository.create({
            companyName: data.companyName,
            email: data.email,
            token,
            expiresAt,
            notes: data.notes,
            invitedBy: { connect: { id: data.invitedById } },
            partner: { connect: { id: partner.id } },
        });
        await partner_event_repository_1.partnerEventRepository.create({
            partnerId: partner.id,
            type: "INVITED",
            actorId: data.invitedById,
            metadata: { inviteId: invite.id },
        });
        return serializeInvite(invite);
    },
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            partner_invite_repository_1.partnerInviteRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                invitedById: params?.invitedById,
                search: params?.search,
            }),
            partner_invite_repository_1.partnerInviteRepository.count({
                status: params?.status,
                invitedById: params?.invitedById,
                search: params?.search,
            }),
        ]);
        const hydrated = await Promise.all(records.map(hydrateInvite));
        return {
            data: hydrated.map(serializeInvite),
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    accept: async (token, payload) => {
        const invite = await partner_invite_repository_1.partnerInviteRepository.findByToken(token);
        if (!invite) {
            throw ApiError_1.ApiError.notFound("Invite not found");
        }
        if (invite.status === "ACCEPTED") {
            throw ApiError_1.ApiError.badRequest("Invite already accepted");
        }
        if (invite.status === "EXPIRED" || invite.expiresAt.getTime() < Date.now()) {
            if (invite.status !== "EXPIRED") {
                await partner_invite_repository_1.partnerInviteRepository.update(invite.id, { status: "EXPIRED" });
            }
            throw ApiError_1.ApiError.badRequest("Invite has expired");
        }
        const updatedInvite = await partner_invite_repository_1.partnerInviteRepository.update(invite.id, {
            status: "ACCEPTED",
            acceptedAt: new Date(),
            metadata: {
                ...(typeof invite.metadata === 'object' && invite.metadata !== null ? invite.metadata : {}),
                contactName: payload.contactName,
                phone: payload.phone,
                notes: payload.notes,
            },
        });
        if (invite.partnerId) {
            await partner_repository_1.partnerRepository.update(invite.partnerId, {
                name: payload.companyName ?? invite.companyName,
                phone: payload.phone,
                isActive: false,
            });
            await partner_event_repository_1.partnerEventRepository.create({
                partnerId: invite.partnerId,
                type: "INVITE_ACCEPTED",
                metadata: {
                    contactName: payload.contactName,
                    phone: payload.phone,
                },
            });
        }
        return serializeInvite(updatedInvite);
    },
};
function addDays(date, days) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
}
async function hydrateInvite(invite) {
    if (invite.status === "PENDING" && invite.expiresAt.getTime() < Date.now()) {
        return partner_invite_repository_1.partnerInviteRepository.update(invite.id, { status: "EXPIRED" });
    }
    return invite;
}
function serializeInvite(invite) {
    const shareUrl = buildShareUrl(invite.token);
    return {
        ...invite,
        shareUrl,
    };
}
function buildShareUrl(token) {
    const base = (config_1.config.partnerInviteBaseUrl ?? "").trim() || inferFallbackBase();
    return `${base.replace(/\/$/, "")}/onboarding/${token}`;
}
function inferFallbackBase() {
    const allowed = config_1.config.allowedOrigins?.split(",").map((value) => value.trim()).filter(Boolean);
    return allowed?.[0] ?? "http://localhost:5173";
}
//# sourceMappingURL=partner-invite.service.js.map