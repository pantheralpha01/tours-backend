import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../offer.repository", () => ({
  offerRepository: {
    createTemplate: vi.fn(),
    updateTemplate: vi.fn(),
    listTemplates: vi.fn(),
    countTemplates: vi.fn(),
    findTemplateById: vi.fn(),
    findTemplateBySlug: vi.fn(),
    createProposal: vi.fn(),
    listProposals: vi.fn(),
    countProposals: vi.fn(),
    findProposalById: vi.fn(),
    findLatestProposalForBooking: vi.fn(),
  },
}));

vi.mock("../../bookings/booking.repository", () => ({
  bookingRepository: {
    findById: vi.fn(),
  },
}));

import { offerRepository } from "../offer.repository";
import { bookingRepository } from "../../bookings/booking.repository";
import { offerService } from "../offer.service";

describe("offerService.ensureProposalForBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the latest proposal when one exists", async () => {
    const existing = { id: "proposal-existing" } as any;
    (offerRepository.findLatestProposalForBooking as any).mockResolvedValue(existing);

    const createSpy = vi.spyOn(offerService, "createProposal");
    const result = await offerService.ensureProposalForBooking("booking-123");

    expect(result).toBe(existing);
    expect(offerRepository.findLatestProposalForBooking).toHaveBeenCalledWith("booking-123");
    expect(createSpy).not.toHaveBeenCalled();
    createSpy.mockRestore();
  });

  it("creates a proposal from booking data when missing", async () => {
    (offerRepository.findLatestProposalForBooking as any).mockResolvedValue(null);
    (bookingRepository.findById as any).mockResolvedValue({
      id: "booking-abc",
      amount: { toNumber: () => 2500 },
      currency: "USD",
    });
    const created = { id: "proposal-new", status: "DRAFT" } as any;
    const createSpy = vi.spyOn(offerService, "createProposal").mockResolvedValue(created);

    const result = await offerService.ensureProposalForBooking("booking-abc", {
      notes: "Auto",
    });

    expect(bookingRepository.findById).toHaveBeenCalledWith("booking-abc");
    expect(createSpy).toHaveBeenCalledWith({
      bookingId: "booking-abc",
      baseAmount: 2500,
      currency: "USD",
      notes: "Auto",
      templateId: undefined,
      metadata: undefined,
      expiresAt: undefined,
      discountRateOverride: undefined,
    });
    expect(result).toBe(created);
    createSpy.mockRestore();
  });
});
