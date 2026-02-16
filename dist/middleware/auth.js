"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const ApiError_1 = require("../utils/ApiError");
const authenticate = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw ApiError_1.ApiError.unauthorized("No token provided");
    }
    const token = header.replace("Bearer ", "").trim();
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: payload.sub, role: payload.role };
        return next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            throw ApiError_1.ApiError.unauthorized("Access token expired");
        }
        throw ApiError_1.ApiError.unauthorized("Invalid access token");
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map