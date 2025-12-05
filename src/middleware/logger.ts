import type { NextFunction } from "express";
import { createLogger, format, transports } from "winston";
import type { UserRequest, UserResponse } from "../types/request.js";
import type { UUIDTypes } from "uuid";
import { extractUserFromToken } from "./isAuthenticated.js";

const { combine, timestamp, json, colorize, printf } = format;

const jsonFormat = combine(timestamp(), json());

export const logger = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
    jsonFormat
  ),
  transports: [
    new transports.Console({
      level: "debug",
      format: combine(
        colorize(),
        timestamp(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length
            ? JSON.stringify(meta, null, 2)
            : "";
          return `[${timestamp}] ${level}: ${message} ${metaString}`;
        })
      ),
    }),
    new transports.File({
      filename: "logs/info.log",
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
      format: jsonFormat,
    }),
    new transports.File({
      filename: "logs/warn.log",
      level: "warn",
      maxsize: 5242880,
      maxFiles: 5,
      format: jsonFormat,
    }),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
      format: jsonFormat,
    }),
  ],
});

const requestLogger = (
  req: UserRequest,
  res: UserResponse,
  next: NextFunction
) => {
  extractUserFromToken(req);
  const { method, url, hostname, ip } = req;
  const userId: UUIDTypes | string = req.user?.userId || "Anonymous";
  const role: string = req.user?.role || "Guest";
  const isVerified: boolean = req.user?.isVerified;
  const isBanned: boolean = req.user?.isBanned;
  const isApproved: boolean = req.user?.isApproved;
  const start = Date.now();

  logger.info(`${method} Request to ${hostname}${url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode: number = res.statusCode;

    const response = {
      method,
      statusCode,
      hostname,
      url,
      userId,
      role,
      isVerified,
      isBanned,
      isApproved,
      userAgent: req.get("User-Agent") || "Unknown",
      duration,
      ip,
    };

    if (statusCode >= 500) {
      logger.error("Server Error", response);
    } else if (statusCode >= 400) {
      if (statusCode === 401 || statusCode === 403) {
        logger.warn("[SECURITY] Unauthorized/Forbidden Access", response);
      } else {
        logger.warn("Client Error", response);
      }
    } else {
      logger.info("Response Information", response);
    }
  });
  return next();
};

export default requestLogger;
