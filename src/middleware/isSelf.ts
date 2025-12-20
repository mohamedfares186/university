import type { NextFunction, Response } from "express";
import type { UserRequest } from "../types/request.js";
import { logger } from "./logger.js";

const isSelf = (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const resourseId = req.params.userId || req.query.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!resourseId) return res.status(400).json({ message: "Bad Request" });

    if ((userId as string) === (resourseId as string)) return next();

    return res.status(403).json({ error: "Access Denied" });
  } catch (error) {
    logger.warn(`Error self access - ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default isSelf;
