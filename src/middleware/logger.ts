import type { NextFunction, Response } from "express";
import { createLogger, format, transports } from "winston";
import type { UserRequest } from "../types/request.js";

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

const requestLogger = (req: UserRequest, res: Response, next: NextFunction) => {
  const start = Date.now();

  logger.info(`${req.method} Request to ${req.host}${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start + "ms";

    const response = {
      duration: duration,
      method: req.method,
      statusCode: res.statusCode,
      protocol: req.protocol,
      host: req.host,
      originalUrl: req.originalUrl,
      headers: req.headers,
      body: req.body ? req.body : null,
      query: req.query ? req.query : null,
      params: req.params ? req.params : null,
      userId: req.user?.userId,
      role: req.user?.role,
      isVerified: req.user?.isVerified,
      isApproved: req.user?.isApproved,
      isBanned: req.user?.isBanned,
      userAgent: req.get("User-Agent") || "Unknown",
      ip: req.ip,
    };

    if (res.statusCode >= 500) {
      logger.error("Server Error", response);
    } else if (res.statusCode >= 400) {
      if (res.statusCode === 401 || res.statusCode === 403) {
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
