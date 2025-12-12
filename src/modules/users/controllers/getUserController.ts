import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import GetUserService from "../services/getUserService.js";
import { logger } from "../../../middleware/logger.js";

class GetUserController {
  constructor(protected getUserService = new GetUserService()) {
    this.getUserService = getUserService;
  }

  getUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const { username } = req.body;
      if (!username)
        return res
          .status(400)
          .json({ success: false, message: "Username is required." });

      const result = await this.getUserService.getUser(username);
      if (!result.success)
        return res
          .status(500)
          .json({ success: result.success, message: result.message });

      return res.status(200).json({
        success: result.success,
        message: result.message,
        user: result.user,
      });
    } catch (error) {
      logger.error(`Error getting user controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default GetUserController;
