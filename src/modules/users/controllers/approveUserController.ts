import type { Response } from "express";
import { logger } from "../../../middleware/logger.js";
import type { UserRequest } from "../../../types/request.js";
import ApproveUserService from "../services/approveUserSerivce.js";

class ApproveUserController {
  constructor(protected approveUserService = new ApproveUserService()) {
    this.approveUserService = approveUserService;
  }

  approveUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const { username } = req.body;

      if (!username)
        return res
          .status(400)
          .json({ success: false, message: "Username is required." });

      const result = await this.approveUserService.approveUser(username);
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
      logger.error(`Error approving user controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}

export default ApproveUserController;
