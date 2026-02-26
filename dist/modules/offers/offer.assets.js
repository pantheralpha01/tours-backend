"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerAssetService = void 0;
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const config_1 = require("../../config");
const file_1 = require("../../utils/file");
const SIGNATURE_CHAR_MAP = ["Alex", "Bianca", "Carter", "Dana", "Eli", "Farah"];
const LOGO_SHAPES = ["circle", "square", "triangle"];
const createSvg = (content) => Buffer.from(content, "utf-8");
const randomChoice = (items) => items[Math.floor(Math.random() * items.length)];
exports.offerAssetService = {
    generateLogo: async () => {
        const color = `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0")}`;
        const shape = randomChoice(LOGO_SHAPES);
        const svg = `<svg width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f7f7f7" rx="12"/>
      <${shape} cx="120" cy="120" r="80" points="120,40 200,200 40,200" fill="${color}" stroke="#111" stroke-width="8"/>
      <text x="120" y="210" font-size="28" font-family="Arial" text-anchor="middle" fill="#333">Tours</text>
    </svg>`;
        return exports.offerAssetService.persistAsset("logo", createSvg(svg), "logo.svg");
    },
    generateSignature: async () => {
        const signer = randomChoice(SIGNATURE_CHAR_MAP);
        const svg = `<svg width="320" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <path d="M10 80 Q 80 10, 150 60 T 310 50" stroke="#111" stroke-width="4" fill="transparent"/>
      <text x="20" y="110" font-size="24" font-family="'Brush Script MT', cursive" fill="#333">${signer} Signature</text>
    </svg>`;
        return exports.offerAssetService.persistAsset("signature", createSvg(svg), "signature.svg");
    },
    persistAsset: async (type, buffer, filename) => {
        const dir = path_1.default.resolve(config_1.config.storage.tempDir, "offers");
        (0, file_1.ensureDir)(dir);
        const uniqueName = `${type}-${Date.now()}-${(0, crypto_1.randomUUID)()}-${filename}`;
        const filepath = (0, file_1.writeTempFile)(dir, uniqueName, buffer);
        const relative = filepath.replace(path_1.default.resolve(config_1.config.storage.tempDir), "");
        const url = config_1.config.storage.baseUrl
            ? `${config_1.config.storage.baseUrl.replace(/\/$/, "")}/${relative.replace(/^\\|\//, "")}`
            : filepath;
        return {
            filepath,
            url,
            metadata: {
                type,
                filename: uniqueName,
            },
        };
    },
};
//# sourceMappingURL=offer.assets.js.map