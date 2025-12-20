import { Op } from "sequelize";
import { logger } from "../../../middleware/logger.js";
import type {
  PageQuery,
  PaginationInfo,
} from "../../../types/miscellaneous.js";
import BaseGetService from "../../base/BaseGetService.js";
import User from "../models/users.js";

interface GetUserResult {
  statusCode: number;
  success: boolean;
  message: string;
  data?: User[] | User;
  pages?: PaginationInfo;
}

class GetUserService extends BaseGetService<User> {
  constructor() {
    super(User, "User");
  }

  async getAllUsers(
    pageQuery: PageQuery,
    isAdmin: boolean = false
  ): Promise<GetUserResult> {
    const result = await this.getAll(pageQuery, isAdmin);
    return {
      ...result,
    };
  }

  async getByUsernameOrEmailOrIdOrPhoneNumber(
    identifier: string
  ): Promise<GetUserResult> {
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
