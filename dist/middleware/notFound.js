"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
const notFoundHandler = (_req, res) => {
    return res.status(404).json(ApiResponse_1.ApiResponse.error("NOT_FOUND", "Route not found"));
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notFound.js.map