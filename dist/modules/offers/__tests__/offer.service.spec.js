"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
vitest_1.vi.mock("../offer.repository", () => ({
    offerRepository: {
        createTemplate: vitest_1.vi.fn(),
        updateTemplate: vitest_1.vi.fn(),
        listTemplates: vitest_1.vi.fn(),
        countTemplates: vitest_1.vi.fn(),
        findTemplateById: vitest_1.vi.fn(),
        findTemplateBySlug: vitest_1.vi.fn(),
        createProposal: vitest_1.vi.fn(),
        listProposals: vitest_1.vi.fn(),
        countProposals: vitest_1.vi.fn(),
        findProposalById: vitest_1.vi.fn(),
        findLatestProposalForBooking: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock("../../bookings/booking.repository", () => ({
    bookingRepository: {
        findById: vitest_1.vi.fn(),
    },
}));
const offer_repository_1 = require("../offer.repository");
const booking_repository_1 = require("../../bookings/booking.repository");
const offer_service_1 = require("../offer.service");
(0, vitest_1.describe)("offerService.ensureProposalForBooking", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("returns the latest proposal when one exists", async () => {
        const existing = { id: "proposal-existing" };
        offer_repository_1.offerRepository.findLatestProposalForBooking.mockResolvedValue(existing);
        const createSpy = vitest_1.vi.spyOn(offer_service_1.offerService, "createProposal");
        const result = await offer_service_1.offerService.ensureProposalForBooking("booking-123");
        (0, vitest_1.expect)(result).toBe(existing);
        (0, vitest_1.expect)(offer_repository_1.offerRepository.findLatestProposalForBooking).toHaveBeenCalledWith("booking-123");
        (0, vitest_1.expect)(createSpy).not.toHaveBeenCalled();
        createSpy.mockRestore();
    });
    (0, vitest_1.it)("creates a proposal from booking data when missing", async () => {
        offer_repository_1.offerRepository.findLatestProposalForBooking.mockResolvedValue(null);
        booking_repository_1.bookingRepository.findById.mockResolvedValue({
            id: "booking-abc",
            amount: { toNumber: () => 2500 },
            currency: "USD",
        });
        const created = { id: "proposal-new", status: "DRAFT" };
        const createSpy = vitest_1.vi.spyOn(offer_service_1.offerService, "createProposal").mockResolvedValue(created);
        const result = await offer_service_1.offerService.ensureProposalForBooking("booking-abc", {
            notes: "Auto",
        });
        (0, vitest_1.expect)(booking_repository_1.bookingRepository.findById).toHaveBeenCalledWith("booking-abc");
        (0, vitest_1.expect)(createSpy).toHaveBeenCalledWith({
            bookingId: "booking-abc",
            baseAmount: 2500,
            currency: "USD",
            notes: "Auto",
            templateId: undefined,
            metadata: undefined,
            expiresAt: undefined,
            discountRateOverride: undefined,
        });
        (0, vitest_1.expect)(result).toBe(created);
        createSpy.mockRestore();
    });
});
//# sourceMappingURL=offer.service.spec.js.map