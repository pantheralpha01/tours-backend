"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTempFile = exports.ensureDir = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ensureDir = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
exports.ensureDir = ensureDir;
const writeTempFile = (dir, filename, data) => {
    (0, exports.ensureDir)(dir);
    const filepath = path_1.default.join(dir, filename);
    fs_1.default.writeFileSync(filepath, data);
    return filepath;
};
exports.writeTempFile = writeTempFile;
//# sourceMappingURL=file.js.map