"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
exports.authController = {
    register: async (req, res) => {
        const payload = auth_validation_1.registerSchema.parse(req.body);
        const result = await auth_service_1.authService.register(payload);
        return res.status(201).json(result);
    },
    login: async (req, res) => {
        const payload = auth_validation_1.loginSchema.parse(req.body);
        const result = await auth_service_1.authService.login(payload);
        return res.status(200).json(result);
    },
    refresh: async (req, res) => {
        const { refreshToken } = auth_validation_1.refreshSchema.parse(req.body);
        const result = await auth_service_1.authService.refresh(refreshToken);
        return res.status(200).json(result);
    },
    logout: async (req, res) => {
        const { refreshToken } = auth_validation_1.logoutSchema.parse(req.body);
        await auth_service_1.authService.logout(refreshToken);
        return res.status(200).json({ message: "Logged out successfully" });
    },
};
//# sourceMappingURL=auth.controller.js.map