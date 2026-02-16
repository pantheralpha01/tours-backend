"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const booking_service_1 = require("./booking.service");
const booking_validation_1 = require("./booking.validation");
const ApiError_1 = require("../../utils/ApiError");
exports.bookingController = {
    create: async (req, res) => {
        const payload = booking_validation_1.createBookingSchema.parse(req.body);
        const agentId = payload.agentId ?? req.user?.id;
        if (!agentId) {
            return res.status(400).json({ message: "agentId is required" });
        }
        const booking = await booking_service_1.bookingService.create({
            ...payload,
            agentId,
            actorId: req.user?.id,
        });
        return res.status(201).json(booking);
    },
    list: async (req, res) => {
        const params = booking_validation_1.listBookingSchema.parse(req.query);
        const agentId = req.user?.role === "AGENT" ? req.user.id : undefined;
        const result = await booking_service_1.bookingService.list({
            ...params,
            agentId,
        });
        return res.status(200).json(result);
    },
    calendar: async (req, res) => {
        const params = booking_validation_1.calendarBookingSchema.parse(req.query);
        const agentId = req.user?.role === "AGENT" ? req.user.id : undefined;
        const now = new Date();
        const defaultStart = params.serviceStartFrom ?? now;
        const defaultEnd = params.serviceStartTo ?? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const result = await booking_service_1.bookingService.list({
            ...params,
            agentId,
            serviceStartFrom: defaultStart,
            serviceStartTo: defaultEnd,
            sort: params.sort ?? "serviceStartAt:asc",
        });
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = booking_validation_1.bookingIdSchema.parse(req.params);
        const booking = await booking_service_1.bookingService.getById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (req.user?.role === "AGENT" && booking.agentId !== req.user.id) {
            throw ApiError_1.ApiError.forbidden("Insufficient permissions");
        }
        return res.status(200).json(booking);
    },
    update: async (req, res) => {
        const { id } = booking_validation_1.bookingIdSchema.parse(req.params);
        if (req.user?.role === "AGENT") {
            const current = await booking_service_1.bookingService.getById(id);
            if (!current) {
                return res.status(404).json({ message: "Booking not found" });
            }
            if (current.agentId !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Insufficient permissions");
            }
        }
        const payload = booking_validation_1.updateBookingSchema.parse(req.body);
        const booking = await booking_service_1.bookingService.update(id, {
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(200).json(booking);
    },
    transition: async (req, res, next) => {
        try {
            const { id } = booking_validation_1.bookingIdSchema.parse(req.params);
            if (req.user?.role === "AGENT") {
                const current = await booking_service_1.bookingService.getById(id);
                if (!current) {
                    return res.status(404).json({ message: "Booking not found" });
                }
                if (current.agentId !== req.user.id) {
                    throw ApiError_1.ApiError.forbidden("Insufficient permissions");
                }
            }
            const payload = booking_validation_1.transitionBookingSchema.parse(req.body);
            const booking = await booking_service_1.bookingService.transitionStatus({
                id,
                toStatus: payload.toStatus,
                transitionReason: payload.transitionReason,
                actorId: req.user?.id,
            });
            return res.status(200).json(booking);
        }
        catch (error) {
            return next(error);
        }
    },
    remove: async (req, res, next) => {
        try {
            const { id } = booking_validation_1.bookingIdSchema.parse(req.params);
            if (req.user?.role === "AGENT") {
                const current = await booking_service_1.bookingService.getById(id);
                if (!current) {
                    return res.status(404).json({ message: "Booking not found" });
                }
                if (current.agentId !== req.user.id) {
                    throw ApiError_1.ApiError.forbidden("Insufficient permissions");
                }
            }
            await booking_service_1.bookingService.remove(id);
            return res.status(204).send();
        }
        catch (error) {
            return next(error);
        }
    },
};
//# sourceMappingURL=booking.controller.js.map