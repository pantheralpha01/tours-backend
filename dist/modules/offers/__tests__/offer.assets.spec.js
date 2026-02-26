"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const vitest_1 = require("vitest");
const TEST_ROOT = path_1.default.resolve(__dirname, "../../../../tmp-tests");
const loadAssetService = async () => {
    const module = await Promise.resolve().then(() => __importStar(require("../offer.assets")));
    return module.offerAssetService;
};
const loadContractService = async () => {
    const module = await Promise.resolve().then(() => __importStar(require("../offer.contract")));
    return module.offerContractService;
};
(0, vitest_1.beforeEach)(() => {
    fs_1.default.rmSync(TEST_ROOT, { recursive: true, force: true });
    process.env.STORAGE_TEMP_DIR = TEST_ROOT;
    delete process.env.STORAGE_BASE_URL;
    vitest_1.vi.resetModules();
});
(0, vitest_1.describe)("offerAssetService", () => {
    (0, vitest_1.it)("persists generated logo assets", async () => {
        const assetService = await loadAssetService();
        const logo = await assetService.generateLogo();
        (0, vitest_1.expect)(logo.metadata.type).toBe("logo");
        (0, vitest_1.expect)(fs_1.default.existsSync(logo.filepath)).toBe(true);
        const svg = fs_1.default.readFileSync(logo.filepath, "utf-8");
        (0, vitest_1.expect)(svg.trim().startsWith("<svg")).toBe(true);
    });
    (0, vitest_1.it)("persists generated signature assets", async () => {
        const assetService = await loadAssetService();
        const signature = await assetService.generateSignature();
        (0, vitest_1.expect)(signature.metadata.type).toBe("signature");
        (0, vitest_1.expect)(fs_1.default.existsSync(signature.filepath)).toBe(true);
        const svg = fs_1.default.readFileSync(signature.filepath, "utf-8");
        (0, vitest_1.expect)(svg).toContain("Signature");
    });
});
(0, vitest_1.describe)("offerContractService", () => {
    (0, vitest_1.it)("builds html contracts with proposal context", async () => {
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
        (0, vitest_1.expect)(fs_1.default.existsSync(contract.filepath)).toBe(true);
        const html = fs_1.default.readFileSync(contract.filepath, "utf-8");
        (0, vitest_1.expect)(html).toContain("Experience Agreement");
        (0, vitest_1.expect)(html).toContain("Sample Client");
        (0, vitest_1.expect)(html).toContain("Safari Adventure");
        (0, vitest_1.expect)(contract.url).toBe(contract.filepath);
        (0, vitest_1.expect)(contract.metadata.filename).toMatch(/contract-.*\.html$/);
    });
});
//# sourceMappingURL=offer.assets.spec.js.map