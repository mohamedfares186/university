import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import DeleteUserService from "../services/deleteUserService.js";
import { logger } from "../../../middleware/logger.js";

class DeleteUserController {
  constructor(protected deleteUserService = new DeleteUserService()) {
    this.deleteUserService = deleteUserService;
  }

  softDelete = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const identifier =
        req.query.userId ||
        req.query.email ||
        req.query.username ||
        req.query.phoneNumber;

      if (!identifier)
        return res
          .status(400)
          .json({ success: false, message: "User identifier is required." });

      const result = await this.deleteUserService.softDelete(
        identifier as string
      );
      if (!result.success)
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        user: result.user,
      });
    } catch (error) {
      logger.error(`Error deleting user controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default DeleteUserController;
