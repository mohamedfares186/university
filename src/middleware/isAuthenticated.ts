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
    const token = extractTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, jwtSecret as string);
      req.user = decoded as JwtPayload;

      if (req.user.isBanned === true)
        return res.status(401).json({ message: "Unauthorized" });

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
