import { Op } from "sequelize";
import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";

interface UpdateUserResult {
  statusCode: number;
  success: boolean;
  message: string;
  data?: User;
}

class UpdateUserService {
  async approveUser(identifier: string): Promise<UpdateUserResult> {
    try {
      const exists = await User.findOne({
        where: {
          [Op.or]: [
            { userId: identifier },
            { email: identifier },
            { username: identifier },
            { phoneNumber: identifier },
          ],
        },
      });

      if (!exists) {
        return {
          statusCode: 404,
          success: false,
          message: "User not found",
        };
      }

      if (exists.isApproved) {
        return {
          statusCode: 400,
          success: false,
          message: "User is already approved",
        };
      }

      exists.isApproved = true;
      exists.save();

      return {
        statusCode: 200,
        success: true,
        message: "User has been approved successfully",
        data: exists,
      };
    } catch (error) {
      logger.error(`Error approving user - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default UpdateUserService;
