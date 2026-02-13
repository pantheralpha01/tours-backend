import { Request, Response, NextFunction } from "express";
import { bookingService } from "./booking.service";
import {
  bookingIdSchema,
  calendarBookingSchema,
  createBookingSchema,
  listBookingSchema,
  transitionBookingSchema,
  updateBookingSchema,
} from "./booking.validation";
import { ApiError } from "../../utils/ApiError";

export const bookingController = {
  create: async (req: Request, res: Response) => {
    const payload = createBookingSchema.parse(req.body);
    const agentId = payload.agentId ?? req.user?.id;

    if (!agentId) {
      return res.status(400).json({ message: "agentId is required" });
    }

    const booking = await bookingService.create({
      ...payload,
      agentId,
      actorId: req.user?.id,
    });
    return res.status(201).json(booking);
  },

  list: async (req: Request, res: Response) => {
    const params = listBookingSchema.parse(req.query);
    const agentId = req.user?.role === "AGENT" ? req.user.id : undefined;
    const result = await bookingService.list({
      ...params,
      agentId,
    });
    return res.status(200).json(result);
  },

  calendar: async (req: Request, res: Response) => {
    const params = calendarBookingSchema.parse(req.query);
    const agentId = req.user?.role === "AGENT" ? req.user.id : undefined;
    const now = new Date();
    const defaultStart = params.serviceStartFrom ?? now;
    const defaultEnd = params.serviceStartTo ?? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const result = await bookingService.list({
      ...params,
      agentId,
      serviceStartFrom: defaultStart,
      serviceStartTo: defaultEnd,
      sort: params.sort ?? "serviceStartAt:asc",
    });
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = bookingIdSchema.parse(req.params);
    const booking = await bookingService.getById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (req.user?.role === "AGENT" && booking.agentId !== req.user.id) {
      throw ApiError.forbidden("Insufficient permissions");
    }
    return res.status(200).json(booking);
  },

  update: async (req: Request, res: Response) => {
    const { id } = bookingIdSchema.parse(req.params);
    if (req.user?.role === "AGENT") {
      const current = await bookingService.getById(id);
      if (!current) {
        return res.status(404).json({ message: "Booking not found" });
      }
      if (current.agentId !== req.user.id) {
        throw ApiError.forbidden("Insufficient permissions");
      }
    }
    const payload = updateBookingSchema.parse(req.body);
    const booking = await bookingService.update(id, {
      ...payload,
      actorId: req.user?.id,
    });
    return res.status(200).json(booking);
  },

  transition: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = bookingIdSchema.parse(req.params);
      if (req.user?.role === "AGENT") {
        const current = await bookingService.getById(id);
        if (!current) {
          return res.status(404).json({ message: "Booking not found" });
        }
        if (current.agentId !== req.user.id) {
          throw ApiError.forbidden("Insufficient permissions");
        }
      }
      const payload = transitionBookingSchema.parse(req.body);
      const booking = await bookingService.transitionStatus({
        id,
        toStatus: payload.toStatus,
        transitionReason: payload.transitionReason,
        actorId: req.user?.id,
      });
      return res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response) => {
    const { id } = bookingIdSchema.parse(req.params);
    if (req.user?.role === "AGENT") {
      const current = await bookingService.getById(id);
      if (!current) {
        return res.status(404).json({ message: "Booking not found" });
      }
      if (current.agentId !== req.user.id) {
        throw ApiError.forbidden("Insufficient permissions");
      }
    }
    await bookingService.remove(id);
    return res.status(204).send();
  },
};
