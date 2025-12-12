import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";

interface GetUserResult {
  success: boolean;
  message: string;
  user?: User;
}

class GetUserService {
  async getUser(username: string): Promise<GetUserResult> {
    try {
      if (!username)
        return {
          success: false,
          message: "Username is required.",
        };

      const findUser = await User.findOne({ where: { username } });
      if (!findUser)
        return {
          success: false,
          message: "Couldn't find this user.",
        };

      return {
        success: true,
        message: "User found.",
        user: findUser,
      };
    } catch (error) {
      logger.error(`Error getting user service - ${error}`);
      return {
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default GetUserService;
