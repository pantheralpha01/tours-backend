import { dispatchRepository } from "./dispatch.repository";
import { dispatchTrackRepository } from "./dispatch-track.repository";
import { dispatchEventRepository } from "./dispatch-event.repository";
import { calculatePagination, PaginatedResponse } from "../../utils/pagination";
import { assertTransition } from "../../utils/stateMachine";
import { dispatchTransitions } from "./dispatch.transitions";

export const dispatchService = {
  create: async (data: {
    bookingId: string;
    assignedToId?: string;
    status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    notes?: string;
    startedAt?: Date;
    completedAt?: Date;
    actorId?: string;
  }) => {
    const initialStatus = data.status ?? "PENDING";
    assertTransition({
      entity: "dispatch",
      currentState: "PENDING",
      targetState: initialStatus,
      transitions: dispatchTransitions,
    });

    const dispatch = await dispatchRepository.create(data);

    await dispatchEventRepository.create({
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

  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    bookingId?: string;
    assignedToId?: string;
    agentId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: string;
  }): Promise<PaginatedResponse<any>> => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      dispatchRepository.findMany({
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
      dispatchRepository.count({
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
      meta: calculatePagination(total, page, limit),
    };
  },

  getById: (id: string) => dispatchRepository.findById(id),

  update: async (
    id: string,
    data: {
      assignedToId?: string;
      status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
      notes?: string;
      startedAt?: Date;
      completedAt?: Date;
      actorId?: string;
      transitionReason?: string;
    }
  ) => {
    const current = await dispatchRepository.findById(id);
    if (!current) {
      throw new Error("Dispatch not found");
    }

    if (data.status) {
      assertTransition({
        entity: "dispatch",
        currentState: current.status,
        targetState: data.status,
        transitions: dispatchTransitions,
      });
    }

    // Filter out fields that don't exist in the Dispatch model
    const { actorId, transitionReason, ...updateData } = data;
    const updated = await dispatchRepository.update(id, updateData);

    if (data.assignedToId && data.assignedToId !== current.assignedToId) {
      await dispatchEventRepository.create({
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
      await dispatchEventRepository.create({
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

  remove: (id: string) => dispatchRepository.remove(id),

  addTrackPoint: (data: {
    dispatchId: string;
    latitude: number;
    longitude: number;
    recordedAt?: Date;
    metadata?: Record<string, unknown>;
  }) => dispatchTrackRepository.create(data),

  listTrackPoints: async (params: {
    dispatchId: string;
    page?: number;
    limit?: number;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<PaginatedResponse<any>> => {
    const page = params.page ?? 1;
    const limit = params.limit ?? 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      dispatchTrackRepository.findMany({
        dispatchId: params.dispatchId,
        skip,
        take: limit,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      }),
      dispatchTrackRepository.count({
        dispatchId: params.dispatchId,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      }),
    ]);

    return {
      data,
      meta: calculatePagination(total, page, limit),
    };
  },

  listTimeline: async (params: {
    dispatchId: string;
    page?: number;
    limit?: number;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<PaginatedResponse<any>> => {
    const page = params.page ?? 1;
    const limit = params.limit ?? 50;

    const trackPoints = await dispatchTrackRepository.findMany({
      dispatchId: params.dispatchId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      take: 1000,
    });

    const events = await dispatchEventRepository.findMany({
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

    const all = [...eventEntries, ...trackEntries].sort(
      (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()
    );

    const start = (page - 1) * limit;
    const end = start + limit;
    const data = all.slice(start, end);

    return {
      data,
      meta: calculatePagination(all.length, page, limit),
    };
  },
};
