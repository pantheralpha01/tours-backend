"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
const user_repository_1 = require("../users/user.repository");
exports.authController = {
    register: async (req, res, next) => {
        try {
            const payload = auth_validation_1.registerSchema.parse(req.body);
            const result = await auth_service_1.authService.register(payload);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const payload = auth_validation_1.loginSchema.parse(req.body);
            const result = await auth_service_1.authService.login(payload);
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    },
    refresh: async (req, res, next) => {
        try {
            const { refreshToken } = auth_validation_1.refreshSchema.parse(req.body);
            const result = await auth_service_1.authService.refresh(refreshToken);
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    },
    logout: async (req, res, next) => {
        try {
            const { refreshToken } = auth_validation_1.logoutSchema.parse(req.body);
            await auth_service_1.authService.logout(refreshToken);
            res.status(200).json({ message: "Logged out successfully" });
        }
        catch (err) {
            next(err);
        }
    },
    me: async (req, res, next) => {
        try {
            if (!req.user?.id) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const user = await user_repository_1.userRepository.findById(req.user.id);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            });
        }
        catch (err) {
            next(err);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map