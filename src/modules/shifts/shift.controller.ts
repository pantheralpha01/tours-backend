import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { shiftService } from "./shift.service";
import {
  createShiftSchema,
  listShiftSchema,
  shiftIdSchema,
  updateShiftSchema,
} from "./shift.validation";

const parseSortDirection = (sort?: string): "asc" | "desc" =>
  sort?.split(":")[1]?.toLowerCase() === "desc" ? "desc" : "asc";

const assertAgentAccess = async (shiftId: string, userId: string) => {
  const shift = await shiftService.getById(shiftId);
  if (!shift) {
    throw ApiError.notFound("Shift not found");
  }
  if (shift.agentId !== userId) {
    throw ApiError.forbidden("Insufficient permissions");
  }
  return shift;
};

export const shiftController = {
  create: async (req: Request, res: Response) => {
    const payload = createShiftSchema.parse(req.body);
    if (req.user?.role === "AGENT" && payload.agentId && payload.agentId !== req.user.id) {
      throw ApiError.forbidden("Agents can only schedule themselves");
    }

    const agentId =
      req.user?.role === "AGENT"
        ? req.user.id
        : payload.agentId ?? req.user?.id;

    if (!agentId) {
      return res.status(400).json({ message: "agentId is required" });
    }

    const shift = await shiftService.create({
      agentId,
      bookingId: payload.bookingId,
      startAt: payload.startAt,
      endAt: payload.endAt,
      status: payload.status,
      notes: payload.notes,
    });

    return res.status(201).json(shift);
  },

  list: async (req: Request, res: Response) => {
    const params = listShiftSchema.parse(req.query);
    const agentId = req.user?.role === "AGENT" ? req.user.id : params.agentId;

    const shifts = await shiftService.list({
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

  getById: async (req: Request, res: Response) => {
    const { id } = shiftIdSchema.parse(req.params);
    const shift = await shiftService.getById(id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }
    if (req.user?.role === "AGENT") {
      await assertAgentAccess(id, req.user.id);
    }
    return res.status(200).json(shift);
  },

  update: async (req: Request, res: Response) => {
    const { id } = shiftIdSchema.parse(req.params);
    const payload = updateShiftSchema.parse(req.body);

    if (req.user?.role === "AGENT") {
      await assertAgentAccess(id, req.user.id);
      if (payload.agentId && payload.agentId !== req.user.id) {
        throw ApiError.forbidden("Agents cannot reassign shifts");
      }
    }

    const bookingId =
      payload.bookingId === undefined
        ? undefined
        : payload.bookingId === null
        ? null
        : payload.bookingId;

    const notes =
      payload.notes === undefined
        ? undefined
        : payload.notes === null
        ? null
        : payload.notes;

    const shift = await shiftService.update(id, {
      agentId: payload.agentId,
      bookingId,
      startAt: payload.startAt,
      endAt: payload.endAt,
      status: payload.status,
      notes,
    });

    return res.status(200).json(shift);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = shiftIdSchema.parse(req.params);
    if (req.user?.role === "AGENT") {
      await assertAgentAccess(id, req.user.id);
    }
    await shiftService.remove(id);
    return res.status(204).send();
  },
};
