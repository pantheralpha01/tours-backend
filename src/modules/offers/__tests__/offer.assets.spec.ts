import fs from "fs";
import path from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const TEST_ROOT = path.resolve(__dirname, "../../../../tmp-tests");

const loadAssetService = async () => {
  const module = await import("../offer.assets");
  return module.offerAssetService;
};

const loadContractService = async () => {
  const module = await import("../offer.contract");
  return module.offerContractService;
};

beforeEach(() => {
  fs.rmSync(TEST_ROOT, { recursive: true, force: true });
  process.env.STORAGE_TEMP_DIR = TEST_ROOT;
  delete process.env.STORAGE_BASE_URL;
  vi.resetModules();
});

describe("offerAssetService", () => {
  it("persists generated logo assets", async () => {
    const assetService = await loadAssetService();
    const logo = await assetService.generateLogo();

    expect(logo.metadata.type).toBe("logo");
    expect(fs.existsSync(logo.filepath)).toBe(true);
    const svg = fs.readFileSync(logo.filepath, "utf-8");
    expect(svg.trim().startsWith("<svg")).toBe(true);
  });

  it("persists generated signature assets", async () => {
    const assetService = await loadAssetService();
    const signature = await assetService.generateSignature();

    expect(signature.metadata.type).toBe("signature");
    expect(fs.existsSync(signature.filepath)).toBe(true);
    const svg = fs.readFileSync(signature.filepath, "utf-8");
    expect(svg).toContain("Signature");
  });
});

describe("offerContractService", () => {
  it("builds html contracts with proposal context", async () => {
    const contractService = await loadContractService();
    const contract = await contractService.generate({
      bookingId: "booking_123",
      customerName: "Sample Client",
      serviceTitle: "Safari Adventure",
      itinerary: [{ day: 1, title: "Arrival", summary: "Airport pickup" }],
      priceBreakdown: {
        baseAmount: 1500,
        addonsTotal: 200,
        fee: { amount: 75 },
        discount: { amount: 100 },
        total: 1675,
      },
      notes: "Remember travel insurance",
      logoUrl: "https://example.com/logo.svg",
      signatureUrl: "https://example.com/signature.svg",
    });

    expect(fs.existsSync(contract.filepath)).toBe(true);
    const html = fs.readFileSync(contract.filepath, "utf-8");
    expect(html).toContain("Experience Agreement");
    expect(html).toContain("Sample Client");
    expect(html).toContain("Safari Adventure");
    expect(contract.url).toBe(contract.filepath);
    expect(contract.metadata.filename).toMatch(/contract-.*\.html$/);
  });
});
