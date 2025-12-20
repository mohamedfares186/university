import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import UpdateUserService from "../services/updateUserService.js";
import { logger } from "../../../middleware/logger.js";

class UpdateUserController {
  constructor(protected updateUserService = new UpdateUserService()) {}

  approveUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const identifier =
        req.query.email || req.query.username || req.query["phone-number"];

      const result = await this.updateUserService.approveUser(
        identifier as string
      );

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      logger.error(`Error approving user controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  banUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const identifier =
        req.query.email || req.query.username || req.query["phone-number"];

      if (!identifier) {
        return res
          .status(400)
          .json({ success: false, message: "User identifier is required" });
      }

      const result = await this.updateUserService.banUser(identifier as string);

      if (!result.success) {
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });
      }

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      logger.error(`Error banning user controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default UpdateUserController;
