import jwt, { type JwtPayload } from "jsonwebtoken";
import { logger } from "./logger.js";
import type { UserRequest } from "../types/request.js";
import type { Response, NextFunction } from "express";
import environment from "../config/env.js";

const { jwtSecret } = environment;

export const extractTokenFromRequest = (req: UserRequest): string | null => {
  const authHeader = req.headers && req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  if (req.cookies && req.cookies["access-token"]) {
    return req.cookies["access-token"];
  }
  return null;
};

const authenticate = (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const requestInfo = {
      method: req.method,
      host: req.host,
      originalUrl: req.originalUrl,
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
    };

    const token = extractTokenFromRequest(req);
    if (!token) {
      logger.warn(`Unauthorized access: `, requestInfo);
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret as string);
      req.user = decoded as JwtPayload;

      if (req.user.isBanned === true) {
        logger.warn(`Banned user: `, {
          ...requestInfo,
          userId: req.user.userId,
          role: req.user.role,
          isVerified: req.user.isVerified,
          isApproved: req.user.isApproved,
          isBanned: req.user.isBanned,
        });
        return res.status(401).json({ message: "Unauthorized" });
      }

      return next();
    } catch (error) {
      logger.warn(`Authentication Failed - ${error}`);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    logger.error(`Authentication Error - ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authenticate;
