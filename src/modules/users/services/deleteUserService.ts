import { Op } from "sequelize";
import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";
import type { BaseReturnResult } from "../../base/BaseReturnResult.js";

class DeleteUserService {
  async softDelete(identifier: string): Promise<BaseReturnResult<User>> {
    try {
      const result = await User.findOne({
        where: {
          [Op.or]: [
            { userId: identifier },
            { username: identifier },
            { email: identifier },
            { phoneNumber: identifier },
          ],
        },
        paranoid: false,
      });

      if (!result) {
        return {
          statusCode: 404,
          success: false,
          message: "User not found.",
        };
      }

      if (result.role === "super_admin") {
        return {
          statusCode: 400,
          success: false,
          message: "Super admin can't be deleted.",
        };
      }

      if (result.deletedAt) {
        return {
          statusCode: 400,
          success: false,
          message: "User is already deleted.",
          data: result,
        };
      }

      const deleteResult = await User.destroy({
        where: {
          [Op.or]: [
            { userId: result.userId },
            { username: result.username },
            { email: result.email },
            { phoneNumber: result.phoneNumber },
          ],
        },
      });
      if (!deleteResult) {
        return {
          statusCode: 500,
          success: false,
          message:
            "Can't delete this user at the moment. Please try again later.",
        };
      }

      return {
        statusCode: 200,
        success: true,
        message: "User has been deleted successfully.",
        data: result,
      };
    } catch (error) {
      logger.error(`Error deleting user service - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default DeleteUserService;
