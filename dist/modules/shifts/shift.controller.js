"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftController = void 0;
const ApiError_1 = require("../../utils/ApiError");
const shift_service_1 = require("./shift.service");
const shift_validation_1 = require("./shift.validation");
const parseSortDirection = (sort) => sort?.split(":")[1]?.toLowerCase() === "desc" ? "desc" : "asc";
const assertAgentAccess = async (shiftId, userId) => {
    const shift = await shift_service_1.shiftService.getById(shiftId);
    if (!shift) {
        throw ApiError_1.ApiError.notFound("Shift not found");
    }
    if (shift.agentId !== userId) {
        throw ApiError_1.ApiError.forbidden("Insufficient permissions");
    }
    return shift;
};
exports.shiftController = {
    create: async (req, res) => {
        const payload = shift_validation_1.createShiftSchema.parse(req.body);
        if (req.user?.role === "AGENT" && payload.agentId && payload.agentId !== req.user.id) {
            throw ApiError_1.ApiError.forbidden("Agents can only schedule themselves");
        }
        const agentId = req.user?.role === "AGENT"
            ? req.user.id
            : payload.agentId ?? req.user?.id;
        if (!agentId) {
            return res.status(400).json({ message: "agentId is required" });
        }
        const shift = await shift_service_1.shiftService.create({
            agentId,
            bookingId: payload.bookingId,
            startAt: payload.startAt,
            endAt: payload.endAt,
            status: payload.status,
            notes: payload.notes,
        });
        return res.status(201).json(shift);
    },
    list: async (req, res) => {
        const params = shift_validation_1.listShiftSchema.parse(req.query);
        const agentId = req.user?.role === "AGENT" ? req.user.id : params.agentId;
        const shifts = await shift_service_1.shiftService.list({
            page: params.page,
            limit: params.limit,
            agentId,
            bookingId: params.bookingId,
            startFrom: params.startFrom,
            startTo: params.startTo,
            status: params.status,
            sort: parseSortDirection(params.sort),
        });
        return res.status(200).json(shifts);
    },
    getById: async (req, res) => {
        const { id } = shift_validation_1.shiftIdSchema.parse(req.params);
        const shift = await shift_service_1.shiftService.getById(id);
        if (!shift) {
            return res.status(404).json({ message: "Shift not found" });
        }
        if (req.user?.role === "AGENT") {
            await assertAgentAccess(id, req.user.id);
        }
        return res.status(200).json(shift);
    },
    update: async (req, res) => {
        const { id } = shift_validation_1.shiftIdSchema.parse(req.params);
        const payload = shift_validation_1.updateShiftSchema.parse(req.body);
        if (req.user?.role === "AGENT") {
            await assertAgentAccess(id, req.user.id);
            if (payload.agentId && payload.agentId !== req.user.id) {
                throw ApiError_1.ApiError.forbidden("Agents cannot reassign shifts");
            }
        }
        const bookingId = payload.bookingId === undefined
            ? undefined
            : payload.bookingId === null
                ? null
                : payload.bookingId;
        const notes = payload.notes === undefined
            ? undefined
            : payload.notes === null
                ? null
                : payload.notes;
        const shift = await shift_service_1.shiftService.update(id, {
            agentId: payload.agentId,
            bookingId,
            startAt: payload.startAt,
            endAt: payload.endAt,
            status: payload.status,
            notes,
        });
        return res.status(200).json(shift);
    },
    remove: async (req, res) => {
        const { id } = shift_validation_1.shiftIdSchema.parse(req.params);
        if (req.user?.role === "AGENT") {
            await assertAgentAccess(id, req.user.id);
        }
        await shift_service_1.shiftService.remove(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=shift.controller.js.map