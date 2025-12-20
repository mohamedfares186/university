import type { NextFunction, Response } from "express";
import type { UserRequest } from "../types/request.js";
import { logger } from "./logger.js";

const isVerified = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user?.isVerified;
    if (user === false)
      return res.status(403).json({ error: "Email Verification is required" });

    return next();
  } catch (error) {
    logger.warn(`Error user not verified - ${error}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default isVerified;
