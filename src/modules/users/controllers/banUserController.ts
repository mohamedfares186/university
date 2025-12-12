import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import BanUserService from "../services/banUserService.js";
import { logger } from "../../../middleware/logger.js";

class BanUserController {
  constructor(protected banUserService = new BanUserService()) {
    this.banUserService = banUserService;
  }

  banUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const { username } = req.body;
      if (!username)
        return res
          .status(400)
          .json({ success: false, message: "Username is required" });

      const result = await this.banUserService.baneUser(username);
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
      logger.error(`Error banning user controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default BanUserController;
