import { Op } from "sequelize";
import { logger } from "../../../middleware/logger.js";
import type {
  PageQuery,
  BaseReturnResult,
} from "../../base/BaseReturnResult.js";
import BaseGetService from "../../base/BaseGetService.js";
import User from "../models/users.js";

class GetUserService extends BaseGetService<User> {
  constructor() {
    super(User, "User");
  }

  async getAllUsers(
    pageQuery: PageQuery,
    isAdmin: boolean = false
  ): Promise<BaseReturnResult<User>> {
    const result = await this.getAll(pageQuery, isAdmin);
    return {
      ...result,
    };
  }

  async getUserById(id: string): Promise<BaseReturnResult<User>> {
    const result = await this.getById(id, true);
    return {
      ...result,
    };
  }

  async getUserByUsernameOrEmailOrIdOrPhoneNumber(
    identifier: string
  ): Promise<BaseReturnResult<User>> {
    try {
      const result = await this.model.findOne({
        where: {
          [Op.or]: [
            { userId: identifier },
            { username: identifier },
            { email: identifier },
            { phoneNumber: identifier },
          ],
        },
      });

      if (!result) {
        return {
          statusCode: 404,
          success: false,
          message: `${this.modelName} not found`,
        };
      }

      return {
        statusCode: 200,
        success: true,
        message: `${this.modelName} found`,
        data: result,
      };
    } catch (error) {
      logger.error(
        `Error getting ${this.modelName.toLowerCase} by ${identifier} - ${error}`
      );
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default GetUserService;
