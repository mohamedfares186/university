import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import DeleteUserService from "../services/deleteUserService.js";
import { logger } from "../../../middleware/logger.js";

class DeleteUserController {
  constructor(protected deleteUserService = new DeleteUserService()) {
    this.deleteUserService = deleteUserService;
  }

  deleteUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const { username } = req.body;
      if (!username)
        return res
          .status(400)
          .json({ success: false, message: "Username is required." });

      const result = await this.deleteUserService.deleteUser(username);
      if (!result.success)
        return res
          .status(500)
          .json({ success: result.success, message: result.message });

      return res
        .status(200)
        .json({
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
