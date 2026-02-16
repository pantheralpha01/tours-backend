"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.signRefreshToken = exports.verifyAccessToken = exports.signAccessToken = exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const signToken = (payload) => jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, { expiresIn: "1d" });
exports.signToken = signToken;
const verifyToken = (token) => jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
exports.verifyToken = verifyToken;
const signAccessToken = (payload) => jsonwebtoken_1.default.sign(payload, config_1.config.accessTokenSecret, { expiresIn: config_1.config.accessTokenExpiry });
exports.signAccessToken = signAccessToken;
const verifyAccessToken = (token) => jsonwebtoken_1.default.verify(token, config_1.config.accessTokenSecret);
exports.verifyAccessToken = verifyAccessToken;
const signRefreshToken = (payload) => jsonwebtoken_1.default.sign(payload, config_1.config.refreshTokenSecret, { expiresIn: config_1.config.refreshTokenExpiry });
exports.signRefreshToken = signRefreshToken;
const verifyRefreshToken = (token) => jsonwebtoken_1.default.verify(token, config_1.config.refreshTokenSecret);
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map