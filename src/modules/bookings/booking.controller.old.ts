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
import { paginationSchema } from "../../utils/pagination";

export const bookingController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = createBookingSchema.parse(req.body);
      const agentId = payload.agentId ?? req.user?.id;

      if (!agentId) {
        throw ApiError.badRequest("agentId is required");
      }

      const booking = await bookingService.create({
        ...payload,
        agentId,
        actorId: req.user?.id,
      });
      return res.status(201).json(booking);
    } catch (error) {
      return next(error);
    }
  },

  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = listBookingSchema.parse(req.query);
      const agentId = req.user?.role === "AGENT" ? req.user.id : undefined;
      const result = await bookingService.list({
        ...params,
        agentId,
      });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  calendar: async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
      return next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = bookingIdSchema.parse(req.params);
      const booking = await bookingService.getById(id);
      if (!booking) {
        throw ApiError.notFound("Booking not found");
      }
      if (req.user?.role === "AGENT" && booking.agentId !== req.user.id) {
        throw ApiError.forbidden("Insufficient permissions");
      }
      return res.status(200).json(booking);
    } catch (error) {
      return next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = bookingIdSchema.parse(req.params);
      if (req.user?.role === "AGENT") {
        const current = await bookingService.getById(id);
        if (!current) {
          throw ApiError.notFound("Booking not found");
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
    } catch (error) {
      return next(error);
    }
  },

  transition: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = bookingIdSchema.parse(req.params);
      if (req.user?.role === "AGENT") {
        const current = await bookingService.getById(id);
        if (!current) {
          throw ApiError.notFound("Booking not found");
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
      return next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = bookingIdSchema.parse(req.params);
      if (req.user?.role === "AGENT") {
        const current = await bookingService.getById(id);
        if (!current) {
          throw ApiError.notFound("Booking not found");
        }
        if (current.agentId !== req.user.id) {
          throw ApiError.forbidden("Insufficient permissions");
        }
      }
      await bookingService.remove(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  },

  events: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = bookingIdSchema.parse(req.params);
      const params = paginationSchema.parse(req.query);
      const booking = await bookingService.getById(id);
      if (!booking) {
        throw ApiError.notFound("Booking not found");
      }
      if (req.user?.role === "AGENT" && booking.agentId !== req.user.id) {
        throw ApiError.forbidden("Insufficient permissions");
      }

      const sortOrder =
        params.sort?.split(":")[1]?.toLowerCase() === "asc" ? "asc" : "desc";

      const timeline = await bookingService.listEvents({
        bookingId: id,
        page: params.page,
        limit: params.limit,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        sort: sortOrder,
      });

      return res.status(200).json(timeline);
    } catch (error) {
      return next(error);
    }
  },
};
