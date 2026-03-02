"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const booking_service_1 = require("./booking.service");
const booking_validation_1 = require("./booking.validation");
const ApiError_1 = require("../../utils/ApiError");
const pagination_1 = require("../../utils/pagination");
exports.bookingController = {
    create: async (req, res, next) => {
        try {
            const payload = booking_validation_1.createBookingSchema.parse(req.body);
            const agentId = payload.agentId ?? req.user?.id;
            if (!agentId) {
                throw new ApiError_1.ApiError(400, "INVALID_REQUEST", "agentId is required");
            }
            const booking = await booking_service_1.bookingService.create({
                ...payload,
                agentId,
                actorId: req.user?.id,
            });
            return res.status(201).json(booking);
        }
        catch (error) {
            return next(error);
        }
    },
    list: async (req, res, next) => {
        try {
            const params = booking_validation_1.listBookingSchema.parse(req.query);
            const agentId = req.user?.role === "AGENT" ? req.user.id : undefined;
            const result = await booking_service_1.bookingService.list({
                ...params,
                agentId,
            });
            return res.status(200).json(result);
        }
        catch (error) {
            return next(error);
        }
    },
    calendar: async (req, res, next) => {
        try {
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
        }
        catch (error) {
            return next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const { id } = booking_validation_1.bookingIdSchema.parse(req.params);
            const booking = await booking_service_1.bookingService.getById(id);
            if (!booking) {
                throw new ApiError_1.ApiError(404, "NOT_FOUND", "Booking not found");
            }
            if (req.user?.role === "AGENT" && booking.agentId !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Insufficient permissions");
            }
            return res.status(200).json(booking);
        }
        catch (error) {
            return next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { id } = booking_validation_1.bookingIdSchema.parse(req.params);
            if (req.user?.role === "AGENT") {
                const current = await booking_service_1.bookingService.getById(id);
                if (!current) {
                    throw new ApiError_1.ApiError(404, "NOT_FOUND", "Booking not found");
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
        }
        catch (error) {
            return next(error);
        }
    },
    transition: async (req, res, next) => {
        try {
            const { id } = booking_validation_1.bookingIdSchema.parse(req.params);
            if (req.user?.role === "AGENT") {
                const current = await booking_service_1.bookingService.getById(id);
                if (!current) {
                    throw new ApiError_1.ApiError(404, "NOT_FOUND", "Booking not found");
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
                    throw new ApiError_1.ApiError(404, "NOT_FOUND", "Booking not found");
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
    events: async (req, res, next) => {
        try {
            const { id } = booking_validation_1.bookingIdSchema.parse(req.params);
            const params = pagination_1.paginationSchema.parse(req.query);
            const booking = await booking_service_1.bookingService.getById(id);
            if (!booking) {
                throw new ApiError_1.ApiError(404, "NOT_FOUND", "Booking not found");
            }
            if (req.user?.role === "AGENT" && booking.agentId !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Insufficient permissions");
            }
            const sortOrder = params.sort?.split(":")[1]?.toLowerCase() === "asc" ? "asc" : "desc";
            const timeline = await booking_service_1.bookingService.listEvents({
                bookingId: id,
                page: params.page,
                limit: params.limit,
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
                sort: sortOrder,
            });
            return res.status(200).json(timeline);
        }
        catch (error) {
            return next(error);
        }
    },
};
//# sourceMappingURL=booking.controller.js.map