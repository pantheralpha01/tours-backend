"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const offer_controller_1 = require("../offer.controller");
const offer_service_1 = require("../offer.service");
vitest_1.vi.mock("../offer.service", () => ({
    offerService: {
        generateAssetsForProposal: vitest_1.vi.fn(),
        generateContract: vitest_1.vi.fn(),
        approveProposal: vitest_1.vi.fn(),
        publishProposal: vitest_1.vi.fn(),
    },
}));
(0, vitest_1.describe)("offerController", () => {
    const createResponse = () => {
        const res = {};
        res.status = vitest_1.vi.fn().mockReturnValue(res);
        res.json = vitest_1.vi.fn().mockReturnValue(res);
        return res;
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("calls generateAssetsForProposal with query overrides", async () => {
        offer_service_1.offerService.generateAssetsForProposal.mockResolvedValue({ id: "550e8400-e29b-41d4-a716-446655440000" });
        const req = {
            params: { id: "550e8400-e29b-41d4-a716-446655440000" },
            query: { logo: "false" },
        };
        const res = createResponse();
        await offer_controller_1.offerController.generateAssets(req, res);
        (0, vitest_1.expect)(offer_service_1.offerService.generateAssetsForProposal).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", {
            logo: false,
            signature: true,
        });
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({ id: "550e8400-e29b-41d4-a716-446655440000" });
    });
    (0, vitest_1.it)("calls generateContract on the service", async () => {
        offer_service_1.offerService.generateContract.mockResolvedValue({
            id: "d9428888-122b-11e1-b85c-61cd3cbb3210",
            pdfUrl: "url",
        });
        const req = { params: { id: "d9428888-122b-11e1-b85c-61cd3cbb3210" } };
        const res = createResponse();
        await offer_controller_1.offerController.generateContract(req, res);
        (0, vitest_1.expect)(offer_service_1.offerService.generateContract).toHaveBeenCalledWith("d9428888-122b-11e1-b85c-61cd3cbb3210");
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            id: "d9428888-122b-11e1-b85c-61cd3cbb3210",
            pdfUrl: "url",
        });
    });
    (0, vitest_1.it)("approves proposals with actor context", async () => {
        offer_service_1.offerService.approveProposal.mockResolvedValue({
            id: "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
            status: "APPROVED",
        });
        const req = {
            params: { id: "1b4e28ba-2fa1-11d2-883f-0016d3cca427" },
            body: { notes: "Looks good" },
            user: { id: "user-123" },
        };
        const res = createResponse();
        await offer_controller_1.offerController.approveProposal(req, res);
        (0, vitest_1.expect)(offer_service_1.offerService.approveProposal).toHaveBeenCalledWith("1b4e28ba-2fa1-11d2-883f-0016d3cca427", {
            actorId: "user-123",
            notes: "Looks good",
        });
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            id: "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
            status: "APPROVED",
        });
    });
    (0, vitest_1.it)("publishes proposals with channel metadata", async () => {
        offer_service_1.offerService.publishProposal.mockResolvedValue({
            id: "1ec9b34c-7c7b-4c5e-9d9f-572cca5b2f21",
            status: "SENT",
        });
        const req = {
            params: { id: "1ec9b34c-7c7b-4c5e-9d9f-572cca5b2f21" },
            body: { channel: "EMAIL", notes: "Sent to client" },
            user: { id: "user-123" },
        };
        const res = createResponse();
        await offer_controller_1.offerController.publishProposal(req, res);
        (0, vitest_1.expect)(offer_service_1.offerService.publishProposal).toHaveBeenCalledWith("1ec9b34c-7c7b-4c5e-9d9f-572cca5b2f21", {
            actorId: "user-123",
            channel: "EMAIL",
            notes: "Sent to client",
        });
        (0, vitest_1.expect)(res.status).toHaveBeenCalledWith(200);
        (0, vitest_1.expect)(res.json).toHaveBeenCalledWith({
            id: "1ec9b34c-7c7b-4c5e-9d9f-572cca5b2f21",
            status: "SENT",
        });
    });
});
//# sourceMappingURL=offer.controller.spec.js.map