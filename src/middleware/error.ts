import { logger } from "./logger.js";
import type { UserRequest, ResponseError } from "../types/request.ts";
import type { NextFunction, Response } from "express";

const error = (
  err: ResponseError,
  req: UserRequest,
  res: Response,
  // eslint-disable-next-line
  _next: NextFunction
) => {
  const userId = req.user?.userId || "Anonymous";
  const role = req.user?.role || "Guest";
  const { message, stack, statusCode, status } = err;
  const { method, url, hostname, ip } = req;

  const error = {
    timestamp: new Date().toISOString(),
    method,
    hostname,
    url,
    status,
    userId,
    role,
    ip,
    userAgent: req.get("User-Agent") || "Unknown",
    stack,
  };

  if (statusCode >= 500) {
    logger.error(`Server Error:`, error);
  }

  if (statusCode >= 400) {
    logger.warn(`Client Error:`, error);
  }

  return res
    .status(statusCode || 500)
    .json({ message: message || "Internal server error" });
};

export default error;
