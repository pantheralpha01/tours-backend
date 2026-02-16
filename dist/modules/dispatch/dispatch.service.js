"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchService = void 0;
const dispatch_repository_1 = require("./dispatch.repository");
const dispatch_track_repository_1 = require("./dispatch-track.repository");
const dispatch_event_repository_1 = require("./dispatch-event.repository");
const pagination_1 = require("../../utils/pagination");
const stateMachine_1 = require("../../utils/stateMachine");
const dispatch_transitions_1 = require("./dispatch.transitions");
exports.dispatchService = {
    create: async (data) => {
        const initialStatus = data.status ?? "PENDING";
        (0, stateMachine_1.assertTransition)({
            entity: "dispatch",
            currentState: "PENDING",
            targetState: initialStatus,
            transitions: dispatch_transitions_1.dispatchTransitions,
        });
        const dispatch = await dispatch_repository_1.dispatchRepository.create(data);
        await dispatch_event_repository_1.dispatchEventRepository.create({
            dispatchId: dispatch.id,
            type: "CREATED",
            actorId: data.actorId,
            metadata: {
                status: dispatch.status,
                assignedToId: dispatch.assignedToId,
            },
        });
        return dispatch;
    },
    list: async (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            dispatch_repository_1.dispatchRepository.findMany({
                skip,
                take: limit,
                status: params?.status,
                bookingId: params?.bookingId,
                assignedToId: params?.assignedToId,
                agentId: params?.agentId,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
                sort: params?.sort,
            }),
            dispatch_repository_1.dispatchRepository.count({
                status: params?.status,
                bookingId: params?.bookingId,
                assignedToId: params?.assignedToId,
                agentId: params?.agentId,
                dateFrom: params?.dateFrom,
                dateTo: params?.dateTo,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    getById: (id) => dispatch_repository_1.dispatchRepository.findById(id),
    update: async (id, data) => {
        const current = await dispatch_repository_1.dispatchRepository.findById(id);
        if (!current) {
            throw new Error("Dispatch not found");
        }
        if (data.status) {
            (0, stateMachine_1.assertTransition)({
                entity: "dispatch",
                currentState: current.status,
                targetState: data.status,
                transitions: dispatch_transitions_1.dispatchTransitions,
            });
        }
        // Filter out fields that don't exist in the Dispatch model
        const { actorId, transitionReason, ...updateData } = data;
        const updated = await dispatch_repository_1.dispatchRepository.update(id, updateData);
        if (data.assignedToId && data.assignedToId !== current.assignedToId) {
            await dispatch_event_repository_1.dispatchEventRepository.create({
                dispatchId: id,
                type: "ASSIGNED",
                actorId: data.actorId,
                metadata: {
                    fromAssignedToId: current.assignedToId,
                    toAssignedToId: data.assignedToId,
                },
            });
        }
        if (data.status && data.status !== current.status) {
            await dispatch_event_repository_1.dispatchEventRepository.create({
                dispatchId: id,
                type: "STATUS_CHANGED",
                actorId: data.actorId,
                metadata: {
                    fromStatus: current.status,
                    toStatus: data.status,
                    reason: data.transitionReason,
                },
            });
        }
        return updated;
    },
    remove: (id) => dispatch_repository_1.dispatchRepository.remove(id),
    addTrackPoint: (data) => dispatch_track_repository_1.dispatchTrackRepository.create(data),
    listTrackPoints: async (params) => {
        const page = params.page ?? 1;
        const limit = params.limit ?? 50;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            dispatch_track_repository_1.dispatchTrackRepository.findMany({
                dispatchId: params.dispatchId,
                skip,
                take: limit,
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
            }),
            dispatch_track_repository_1.dispatchTrackRepository.count({
                dispatchId: params.dispatchId,
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
            }),
        ]);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(total, page, limit),
        };
    },
    listTimeline: async (params) => {
        const page = params.page ?? 1;
        const limit = params.limit ?? 50;
        const trackPoints = await dispatch_track_repository_1.dispatchTrackRepository.findMany({
            dispatchId: params.dispatchId,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            take: 1000,
        });
        const events = await dispatch_event_repository_1.dispatchEventRepository.findMany({
            dispatchId: params.dispatchId,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            take: 1000,
        });
        const eventEntries = events.map((event) => ({
            type: `EVENT_${event.type}`,
            occurredAt: event.createdAt,
            data: {
                id: event.id,
                actorId: event.actorId,
                metadata: event.metadata,
            },
        }));
        const trackEntries = trackPoints.map((point) => ({
            type: "TRACK_POINT",
            occurredAt: point.recordedAt,
            data: {
                id: point.id,
                latitude: point.latitude,
                longitude: point.longitude,
                metadata: point.metadata,
            },
        }));
        const all = [...eventEntries, ...trackEntries].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = all.slice(start, end);
        return {
            data,
            meta: (0, pagination_1.calculatePagination)(all.length, page, limit),
        };
    },
};
//# sourceMappingURL=dispatch.service.js.map