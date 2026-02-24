import { beforeEach, describe, expect, it, vi } from "vitest";

import { offerController } from "../offer.controller";
import { offerService } from "../offer.service";

vi.mock("../offer.service", () => ({
  offerService: {
    generateAssetsForProposal: vi.fn(),
    generateContract: vi.fn(),
    approveProposal: vi.fn(),
    publishProposal: vi.fn(),
  },
}));

describe("offerController", () => {
  const createResponse = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls generateAssetsForProposal with query overrides", async () => {
    (offerService.generateAssetsForProposal as any).mockResolvedValue({ id: "550e8400-e29b-41d4-a716-446655440000" });
    const req: any = {
      params: { id: "550e8400-e29b-41d4-a716-446655440000" },
      query: { logo: "false" },
    };
    const res = createResponse();

    await offerController.generateAssets(req, res);

    expect(offerService.generateAssetsForProposal).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000", {
      logo: false,
      signature: true,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: "550e8400-e29b-41d4-a716-446655440000" });
  });

  it("calls generateContract on the service", async () => {
    (offerService.generateContract as any).mockResolvedValue({
      id: "d9428888-122b-11e1-b85c-61cd3cbb3210",
      pdfUrl: "url",
    });
    const req: any = { params: { id: "d9428888-122b-11e1-b85c-61cd3cbb3210" } };
    const res = createResponse();

    await offerController.generateContract(req, res);

    expect(offerService.generateContract).toHaveBeenCalledWith("d9428888-122b-11e1-b85c-61cd3cbb3210");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: "d9428888-122b-11e1-b85c-61cd3cbb3210",
      pdfUrl: "url",
    });
  });

  it("approves proposals with actor context", async () => {
    (offerService.approveProposal as any).mockResolvedValue({
      id: "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
      status: "APPROVED",
    });
    const req: any = {
      params: { id: "1b4e28ba-2fa1-11d2-883f-0016d3cca427" },
      body: { notes: "Looks good" },
      user: { id: "user-123" },
    };
    const res = createResponse();

    await offerController.approveProposal(req, res);

    expect(offerService.approveProposal).toHaveBeenCalledWith("1b4e28ba-2fa1-11d2-883f-0016d3cca427", {
      actorId: "user-123",
      notes: "Looks good",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
      status: "APPROVED",
    });
  });

  it("publishes proposals with channel metadata", async () => {
    (offerService.publishProposal as any).mockResolvedValue({
      id: "1ec9b34c-7c7b-4c5e-9d9f-572cca5b2f21",
      status: "SENT",
    });
    const req: any = {
      params: { id: "1ec9b34c-7c7b-4c5e-9d9f-572cca5b2f21" },
      body: { channel: "EMAIL", notes: "Sent to client" },
      user: { id: "user-123" },
    };
    const res = createResponse();

    await offerController.publishProposal(req, res);

    expect(offerService.publishProposal).toHaveBeenCalledWith("1ec9b34c-7c7b-4c5e-9d9f-572cca5b2f21", {
      actorId: "user-123",
      channel: "EMAIL",
      notes: "Sent to client",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: "1ec9b34c-7c7b-4c5e-9d9f-572cca5b2f21",
      status: "SENT",
    });
  });
});
