import { randomUUID } from "node:crypto";
import { PartnerInviteStatus } from "@prisma/client";

import { config } from "../../config";
import { ApiError } from "../../utils/ApiError";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { partnerInviteRepository, type PartnerInviteWithRelations } from "./partner-invite.repository";
import { partnerRepository } from "../partners/partner.repository";
import { partnerEventRepository } from "../partners/partner-event.repository";

const DEFAULT_EXPIRY_DAYS = 14;

export const partnerInviteService = {
  create: async (data: {
    companyName: string;
    email: string;
    invitedById: string;
    expiresInDays?: number;
    notes?: string;
  }) => {
    const existingPartner = data.email
      ? await partnerRepository.findByEmail(data.email)
      : null;

    if (existingPartner && existingPartner.approvalStatus === "APPROVED") {
      throw ApiError.badRequest("Partner already approved for this email");
    }

    const pendingInvite = await partnerInviteRepository.findActiveByEmail(data.email);
    if (pendingInvite) {
      throw ApiError.badRequest("An active invite already exists for this email");
    }

    const partner =
      existingPartner ??
      (await partnerRepository.create({
        name: data.companyName,
        email: data.email,
        isActive: false,
        createdById: data.invitedById,
      }));

    const token = randomUUID();
    const expiresAt = addDays(new Date(), data.expiresInDays ?? DEFAULT_EXPIRY_DAYS);

    const invite = await partnerInviteRepository.create({
      companyName: data.companyName,
      email: data.email,
      token,
      expiresAt,
      notes: data.notes,
      invitedBy: { connect: { id: data.invitedById } },
      partner: { connect: { id: partner.id } },
    });

    await partnerEventRepository.create({
      partnerId: partner.id,
      type: "INVITED",
      actorId: data.invitedById,
      metadata: { inviteId: invite.id },
    });

    return serializeInvite(invite);
  },

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: PartnerInviteStatus;
    invitedById?: string;
    search?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      partnerInviteRepository.findMany({
        skip,
        take: limit,
        status: params?.status,
        invitedById: params?.invitedById,
        search: params?.search,
      }),
      partnerInviteRepository.count({
        status: params?.status,
        invitedById: params?.invitedById,
        search: params?.search,
      }),
    ]);

    const hydrated = await Promise.all(records.map(hydrateInvite));

    return {
      data: hydrated.map(serializeInvite),
      meta: calculatePagination(total, page, limit),
    };
  },

  accept: async (token: string, payload: { contactName: string; phone?: string; companyName?: string; notes?: string }) => {
    const invite = await partnerInviteRepository.findByToken(token);
    if (!invite) {
      throw ApiError.notFound("Invite not found");
    }

    if (invite.status === "ACCEPTED") {
      throw ApiError.badRequest("Invite already accepted");
    }

    if (invite.status === "EXPIRED" || invite.expiresAt.getTime() < Date.now()) {
      if (invite.status !== "EXPIRED") {
        await partnerInviteRepository.update(invite.id, { status: "EXPIRED" });
      }
      throw ApiError.badRequest("Invite has expired");
    }

    const updatedInvite = await partnerInviteRepository.update(invite.id, {
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
      await partnerRepository.update(invite.partnerId, {
        name: payload.companyName ?? invite.companyName,
        phone: payload.phone,
        isActive: false,
      });

      await partnerEventRepository.create({
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

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

async function hydrateInvite(invite: PartnerInviteWithRelations) {
  if (invite.status === "PENDING" && invite.expiresAt.getTime() < Date.now()) {
    return partnerInviteRepository.update(invite.id, { status: "EXPIRED" });
  }
  return invite;
}

function serializeInvite(invite: PartnerInviteWithRelations) {
  const shareUrl = buildShareUrl(invite.token);
  return {
    ...invite,
    shareUrl,
  };
}

function buildShareUrl(token: string) {
  const base = (config.partnerInviteBaseUrl ?? "").trim() || inferFallbackBase();
  return `${base.replace(/\/$/, "")}/onboarding/${token}`;
}

function inferFallbackBase() {
  const allowed = config.allowedOrigins?.split(",").map((value) => value.trim()).filter(Boolean);
  return allowed?.[0] ?? "http://localhost:5173";
}
