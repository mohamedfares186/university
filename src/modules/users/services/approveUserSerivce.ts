import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";

interface ApproveUserResult {
  success: boolean;
  message: string;
  user?: User;
}

class ApproveUserService {
  async approveUser(username: string): Promise<ApproveUserResult> {
    try {
      if (!username)
        return {
          success: false,
          message: "Username is required.",
        };

      const result = await User.findOne({ where: { username } });
      if (!result)
        return {
          success: false,
          message: "User not found.",
        };

      if (result.isApproved === true)
        return {
          success: false,
          message: "User is already approved.",
          user: result,
        };

      result.isApproved = true;
      result.updatedAt = Date.now();
      const saveResult = await result.save();
      if (!saveResult)
        return {
          success: false,
          message: "Couldn't approve this user, please try again later.",
        };

      return {
        success: true,
        message: "User has been verified successfully.",
        user: result,
      };
    } catch (error) {
      logger.error(`Error approving user service - ${error}`);
      return {
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default ApproveUserService;
