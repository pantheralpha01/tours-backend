import jwt from "jsonwebtoken";
import { config } from "../config";

export type JwtPayload = {
  sub: string;
  role: "ADMIN" | "AGENT" | "MANAGER";
};

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: "1d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, config.jwtSecret) as JwtPayload;

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, config.accessTokenSecret, { expiresIn: config.accessTokenExpiry });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.accessTokenSecret) as JwtPayload;

export const signRefreshToken = (payload: { sub: string }) =>
  jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiry });

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, config.refreshTokenSecret) as { sub: string };
