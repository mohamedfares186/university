import slowDown from "express-slow-down";
import type { UserRequest } from "../types/request.js";
import type { NextFunction, Response } from "express";
import { logger } from "./logger.js";
import type { Options } from "express-slow-down";

const slowDownHandler = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
  options: Options
) => {
  const err = {
    status: "error",
    message: "Too many requests, please try again later",
    retryAfter: Math.round(options.windowMs / 1000),
    limit: options.delayAfter,
    windowMs: options.windowMs,
  };

  logger.warn("Slow down limit exceeded:", {
    method: req.method,
    hostname: req.hostname,
    url: req.url,
    userId: req.user?.userId || "anonymous",
    level: req.user?.role || "unknown",
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  return res.status(429).json(err);
};

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1000,
  delayMs: 500,
  maxDelayMs: 5 * 60 * 1000,
  handler: slowDownHandler,
} as Options);

export default speedLimiter;
