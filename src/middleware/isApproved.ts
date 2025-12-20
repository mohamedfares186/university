import type { NextFunction, Response } from "express";
import type { UserRequest } from "../types/request.js";
import { logger } from "./logger.js";

const approve = (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const isApproved = req.user?.isApproved;

    if (!isApproved)
      return res.status(401).json({
        message:
          "Admin has to approve this user to be able to access this resource",
      });

    return next();
  } catch (error) {
    logger.error(`Error checking approved user - ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default approve;
