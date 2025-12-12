import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";

interface GetAllUsersResult {
  success: boolean;
  message: string;
  users?: User[];
}

class GetAllUsersService {
  async getAllUsers(): Promise<GetAllUsersResult> {
    try {
      const users = await User.findAll();
      if (!users)
        return {
          success: false,
          message: "Can't get all users",
        };

      return {
        success: true,
        message: "Users found",
        users: users,
      };
    } catch (error) {
      logger.error(`Error getting all users service - ${error}`);
      return {
        success: false,
        message: "Internal server error",
      };
    }
  }
}

export default GetAllUsersService;
