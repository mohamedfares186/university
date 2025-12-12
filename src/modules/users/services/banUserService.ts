import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";

interface BanUserResult {
  success: boolean;
  message: string;
  user?: User;
}

class BanUserService {
  async baneUser(username: string): Promise<BanUserResult> {
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

      if (result.role === "super_admin")
        return {
          success: false,
          message: "Super admin can't be banned.",
        };

      if (result.isBanned === true)
        return {
          success: false,
          message: "User is already banned.",
        };

      result.isBanned = true;
      const saveResult = await result.save();
      if (!saveResult)
        return {
          success: false,
          message: "Couldn't ban this user. Please try again later.",
        };

      return {
        success: true,
        message: "User has been banned successfully.",
        user: result,
      };
    } catch (error) {
      logger.error(`Error banning user service - ${error}`);
      return {
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default BanUserService;
