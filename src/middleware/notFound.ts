import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";

export const notFoundHandler = (_req: Request, res: Response) => {
  return res.status(404).json(ApiResponse.error("NOT_FOUND", "Route not found"));
};
