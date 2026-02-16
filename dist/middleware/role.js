"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = void 0;
const ApiError_1 = require("../utils/ApiError");
const requireRoles = (...roles) => {
    return (req, _res, next) => {
        const role = req.user?.role;
        if (!role || !roles.includes(role)) {
            throw ApiError_1.ApiError.forbidden("Insufficient permissions");
        }
        return next();
    };
};
exports.requireRoles = requireRoles;
//# sourceMappingURL=role.js.map