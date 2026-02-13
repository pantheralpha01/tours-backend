import { Request, Response } from "express";
import { dispatchService } from "./dispatch.service";
import {
  createDispatchSchema,
  createTrackPointSchema,
  dispatchIdSchema,
  listDispatchSchema,
  updateDispatchSchema,
} from "./dispatch.validation";
import { bookingService } from "../bookings/booking.service";
import { paginationSchema } from "../../utils/pagination";
import { ApiError } from "../../utils/ApiError";

const assertAgentAccess = async (dispatchId: string, userId: string) => {
  const dispatch = await dispatchService.getById(dispatchId);
  if (!dispatch) {
    throw ApiError.notFound("Dispatch not found");
  }
  if (dispatch.assignedToId === userId) {
    return dispatch;
  }
  if (dispatch.booking.agentId !== userId) {
    throw ApiError.forbidden("Insufficient permissions");
  }
  return dispatch;
};

export const dispatchController = {
  create: async (req: Request, res: Response) => {
    const payload = createDispatchSchema.parse(req.body);
    const booking = await bookingService.getById(payload.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user?.role === "AGENT") {
      if (booking.agentId !== req.user.id) {
        throw ApiError.forbidden("Insufficient permissions");
      }
      if (payload.assignedToId && payload.assignedToId !== req.user.id) {
        throw ApiError.forbidden("Agents can only assign themselves");
      }
    }

    const dispatch = await dispatchService.create({
      ...payload,
      assignedToId: payload.assignedToId ?? req.user?.id,
      actorId: req.user?.id,
    });
    return res.status(201).json(dispatch);
  },

  list: async (req: Request, res: Response) => {
    const params = listDispatchSchema.parse(req.query);
    const agentId = req.user?.role === "AGENT" ? req.user.id : undefined;
    const result = await dispatchService.list({
      ...params,
      agentId,
    });
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = dispatchIdSchema.parse(req.params);
    const dispatch = await dispatchService.getById(id);
    if (!dispatch) {
      return res.status(404).json({ message: "Dispatch not found" });
    }
    if (req.user?.role === "AGENT") {
      await assertAgentAccess(id, req.user.id);
    }
    return res.status(200).json(dispatch);
  },

  update: async (req: Request, res: Response) => {
    const { id } = dispatchIdSchema.parse(req.params);
    const payload = updateDispatchSchema.parse(req.body);
    if (req.user?.role === "AGENT") {
      const dispatch = await assertAgentAccess(id, req.user.id);
      if (payload.assignedToId && payload.assignedToId !== req.user.id) {
        throw ApiError.forbidden("Agents can only assign themselves");
      }
      if (payload.status) {
        const allowed: (typeof payload.status)[] = ["IN_PROGRESS", "COMPLETED"];
        if (!allowed.includes(payload.status)) {
          throw ApiError.forbidden("Agents cannot set that status");
        }
        if (dispatch.assignedToId !== req.user.id) {
          throw ApiError.forbidden("Only the assigned agent can change status");
        }
      }
    }
    const dispatch = await dispatchService.update(id, {
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(200).json(dispatch);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = dispatchIdSchema.parse(req.params);
    if (req.user?.role === "AGENT") {
      await assertAgentAccess(id, req.user.id);
    }
    await dispatchService.remove(id);
    return res.status(204).send();
  },

  addTrackPoint: async (req: Request, res: Response) => {
    const { id } = dispatchIdSchema.parse(req.params);
    const payload = createTrackPointSchema.parse(req.body);
    if (req.user?.role === "AGENT") {
      await assertAgentAccess(id, req.user.id);
    }
    const point = await dispatchService.addTrackPoint({
      dispatchId: id,
      latitude: payload.latitude,
      longitude: payload.longitude,
      recordedAt: payload.recordedAt,
      metadata: payload.metadata,
    });
    return res.status(201).json(point);
  },

  listTrackPoints: async (req: Request, res: Response) => {
    const { id } = dispatchIdSchema.parse(req.params);
    const params = paginationSchema.parse(req.query);
    if (req.user?.role === "AGENT") {
      await assertAgentAccess(id, req.user.id);
    }
    const result = await dispatchService.listTrackPoints({
      dispatchId: id,
      page: params.page,
      limit: params.limit,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    });
    return res.status(200).json(result);
  },

  timeline: async (req: Request, res: Response) => {
    const { id } = dispatchIdSchema.parse(req.params);
    const params = paginationSchema.parse(req.query);
    if (req.user?.role === "AGENT") {
      await assertAgentAccess(id, req.user.id);
    }
    const result = await dispatchService.listTimeline({
      dispatchId: id,
      page: params.page,
      limit: params.limit,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    });
    return res.status(200).json(result);
  },
};
