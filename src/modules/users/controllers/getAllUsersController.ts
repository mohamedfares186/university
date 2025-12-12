import type { Response } from "express";
import GetAllUsersService from "../services/getAllUsersService.js";
import { logger } from "../../../middleware/logger.js";
import type { UserRequest } from "../../../types/request.js";

class GetAllUsersController {
  constructor(protected getAllUsersService = new GetAllUsersService()) {
    this.getAllUsersService = getAllUsersService;
  }

  getAllUsers = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const result = await this.getAllUsersService.getAllUsers();
      if (!result.success)
        return res
          .status(500)
          .json({ success: result.success, message: result.message });

      return res.status(200).json({
        success: result.success,
        message: result.message,
        users: result.users,
      });
    } catch (error) {
      logger.error(`Error getting all users controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}

export default GetAllUsersController;
