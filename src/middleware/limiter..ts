import type { NextFunction, Response } from "express";
import rateLimit, {
  type Options,
  type RateLimitExceededEventHandler,
} from "express-rate-limit";
import type { UserRequest } from "../types/request.js";
import { logger } from "./logger.js";
import environment from "../config/env.js";

const { env } = environment;

const rateLimitHandler: RateLimitExceededEventHandler = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
  options: Options
): Response => {
  const error = {
    status: "error",
    message: "Too many requests, please try again later",
    retryAfter: `${Math.round(options.windowMs / 1000) / 60} Minutes`,
    limit: options.limit,
    window: `${Math.round(options.windowMs / 1000) / 60} Minutes`,
  };

  logger.warn("Rate limit exceeded:", {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.userId || "anonymous",
    timestamp: new Date().toISOString(),
  });

  return res.status(429).json(error);
};

const skipRequests = (): boolean => {
  if (env === "production" || env === "staging" || env === "development") {
    return false;
  }
  return true;
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipRequests,
});

export const authLimiter = rateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 20,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: skipRequests,
});

export default limiter;
