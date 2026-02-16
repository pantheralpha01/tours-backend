"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchController = void 0;
const dispatch_service_1 = require("./dispatch.service");
const dispatch_validation_1 = require("./dispatch.validation");
const booking_service_1 = require("../bookings/booking.service");
const pagination_1 = require("../../utils/pagination");
const ApiError_1 = require("../../utils/ApiError");
const assertAgentAccess = async (dispatchId, userId) => {
    const dispatch = await dispatch_service_1.dispatchService.getById(dispatchId);
    if (!dispatch) {
        throw ApiError_1.ApiError.notFound("Dispatch not found");
    }
    if (dispatch.assignedToId === userId) {
        return dispatch;
    }
    if (dispatch.booking.agentId !== userId) {
        throw ApiError_1.ApiError.forbidden("Insufficient permissions");
    }
    return dispatch;
};
exports.dispatchController = {
    create: async (req, res) => {
        const payload = dispatch_validation_1.createDispatchSchema.parse(req.body);
        const booking = await booking_service_1.bookingService.getById(payload.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (req.user?.role === "AGENT") {
            if (booking.agentId !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Insufficient permissions");
            }
            if (payload.assignedToId && payload.assignedToId !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Agents can only assign themselves");
            }
        }
        const dispatch = await dispatch_service_1.dispatchService.create({
            ...payload,
            assignedToId: payload.assignedToId ?? req.user?.id,
            actorId: req.user?.id,
        });
        return res.status(201).json(dispatch);
    },
    list: async (req, res) => {
        const params = dispatch_validation_1.listDispatchSchema.parse(req.query);
        const agentId = req.user?.role === "AGENT" ? req.user.id : undefined;
        const result = await dispatch_service_1.dispatchService.list({
            ...params,
            agentId,
        });
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = dispatch_validation_1.dispatchIdSchema.parse(req.params);
        const dispatch = await dispatch_service_1.dispatchService.getById(id);
        if (!dispatch) {
            return res.status(404).json({ message: "Dispatch not found" });
        }
        if (req.user?.role === "AGENT") {
            await assertAgentAccess(id, req.user.id);
        }
        return res.status(200).json(dispatch);
    },
    update: async (req, res) => {
        const { id } = dispatch_validation_1.dispatchIdSchema.parse(req.params);
        const payload = dispatch_validation_1.updateDispatchSchema.parse(req.body);
        if (req.user?.role === "AGENT") {
            const dispatch = await assertAgentAccess(id, req.user.id);
            if (payload.assignedToId && payload.assignedToId !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Agents can only assign themselves");
            }
            if (payload.status) {
                const allowed = ["IN_PROGRESS", "COMPLETED"];
                if (!allowed.includes(payload.status)) {
                    throw ApiError_1.ApiError.forbidden("Agents cannot set that status");
                }
                if (dispatch.assignedToId !== req.user.id) {
                    throw ApiError_1.ApiError.forbidden("Only the assigned agent can change status");
                }
            }
        }
        const dispatch = await dispatch_service_1.dispatchService.update(id, {
            ...payload,
            actorId: req.user?.id,
        });
        return res.status(200).json(dispatch);
    },
    remove: async (req, res) => {
        const { id } = dispatch_validation_1.dispatchIdSchema.parse(req.params);
        if (req.user?.role === "AGENT") {
            await assertAgentAccess(id, req.user.id);
        }
        await dispatch_service_1.dispatchService.remove(id);
        return res.status(204).send();
    },
    addTrackPoint: async (req, res) => {
        const { id } = dispatch_validation_1.dispatchIdSchema.parse(req.params);
        const payload = dispatch_validation_1.createTrackPointSchema.parse(req.body);
        if (req.user?.role === "AGENT") {
            await assertAgentAccess(id, req.user.id);
        }
        const point = await dispatch_service_1.dispatchService.addTrackPoint({
            dispatchId: id,
            latitude: payload.latitude,
            longitude: payload.longitude,
            recordedAt: payload.recordedAt,
            metadata: payload.metadata,
        });
        return res.status(201).json(point);
    },
    listTrackPoints: async (req, res) => {
        const { id } = dispatch_validation_1.dispatchIdSchema.parse(req.params);
        const params = pagination_1.paginationSchema.parse(req.query);
        if (req.user?.role === "AGENT") {
            await assertAgentAccess(id, req.user.id);
        }
        const result = await dispatch_service_1.dispatchService.listTrackPoints({
            dispatchId: id,
            page: params.page,
            limit: params.limit,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
        });
        return res.status(200).json(result);
    },
    timeline: async (req, res) => {
        const { id } = dispatch_validation_1.dispatchIdSchema.parse(req.params);
        const params = pagination_1.paginationSchema.parse(req.query);
        if (req.user?.role === "AGENT") {
            await assertAgentAccess(id, req.user.id);
        }
        const result = await dispatch_service_1.dispatchService.listTimeline({
            dispatchId: id,
            page: params.page,
            limit: params.limit,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
        });
        return res.status(200).json(result);
    },
};
//# sourceMappingURL=dispatch.controller.js.map