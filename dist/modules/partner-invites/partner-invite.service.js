"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerInviteService = void 0;
const ApiError_1 = require("../../utils/ApiError");
exports.partnerInviteService = {
    create: async () => {
        throw ApiError_1.ApiError.badRequest("Partner invitations have been deprecated. Please use the direct signup endpoint at POST /api/partners/signup instead.");
    },
    list: async () => {
        throw ApiError_1.ApiError.badRequest("Partner invitations have been deprecated. Please use the direct signup endpoint instead.");
    },
    accept: async () => {
        throw ApiError_1.ApiError.badRequest("Partner invitations have been deprecated. Please use the direct signup endpoint instead.");
    },
};
//# sourceMappingURL=partner-invite.service.js.map