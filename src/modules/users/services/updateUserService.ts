import { Op } from "sequelize";
import { logger } from "../../../middleware/logger.js";
import User from "../models/users.js";
import type { BaseReturnResult } from "../../base/BaseReturnResult.js";

class UpdateUserService {
  async approveUser(identifier: string): Promise<BaseReturnResult<User>> {
    try {
      const exists = await User.findOne({
        where: {
          [Op.or]: [
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
      const result = await exists.save();

      if (!result) {
        return {
          statusCode: 500,
          success: false,
          message:
            "Can't approve this user at the moment. Please try again later.",
        };
      }

      return {
        statusCode: 200,
        success: true,
        message: "User has been approved successfully",
        data: result,
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

  async banUser(identifier: string): Promise<BaseReturnResult<User>> {
    try {
      const exists = await User.findOne({
        where: {
          [Op.or]: [
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

      if (exists.isBanned === true) {
        return {
          statusCode: 400,
          success: false,
          message: "User is already banned",
        };
      }

      exists.isBanned = false;
      const result = await exists.save();
      if (!result) {
        return {
          statusCode: 500,
          success: false,
          message:
            "Cant't ban this user at the moment. Please try again later.",
        };
      }

      return {
        statusCode: 200,
        success: true,
        message: "User has been banned successfully",
        data: result,
      };
    } catch (error) {
      logger.error(`Error banning user - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default UpdateUserService;
