import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";

interface DeleteUserResult {
  success: boolean;
  message: string;
  user?: User;
}

class DeleteUserService {
  async deleteUser(username: string): Promise<DeleteUserResult> {
    try {
      if (!username)
        return {
          success: false,
          message: "Username is required.",
        };

      const result = await User.findOne({
        where: { username },
        paranoid: false,
      });
      if (!result)
        return {
          success: false,
          message: "User not found.",
        };

      if (result.role === "super_admin")
        return {
          success: false,
          message: "Super admin can't be deleted.",
        };

      if (result.deletedAt)
        return {
          success: false,
          message: "User is already deleted.",
          user: result,
        };

      const deleteResult = await User.destroy({ where: { username } });
      if (!deleteResult)
        return {
          success: false,
          message: "Couldn't delete this user. Please try again later.",
        };

      return {
        success: true,
        message: "User has been deleted successfully.",
        user: result,
      };
    } catch (error) {
      logger.error(`Error deleting user service - ${error}`);
      return {
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default DeleteUserService;
