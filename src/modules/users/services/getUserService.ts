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

  async getUserByUsernameOrEmailOrOrPhoneNumber(
    identifier: string
  ): Promise<BaseReturnResult<User>> {
    try {
      const result = await this.model.findOne({
        where: {
          [Op.or]: [
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

  async getUserByRole(
    role: string,
    pageQuery: PageQuery
  ): Promise<BaseReturnResult<User>> {
    try {
      const { limit, pageNumber } = pageQuery;

      const validPageNumber = Math.max(1, Math.floor(pageNumber));
      const validLimitNumber = Math.max(1, Math.floor(limit));

      if (validLimitNumber > 150) {
        return {
          statusCode: 400,
          success: false,
          message: "Items per pages can't exceed 150.",
        };
      }

      const offset = (validPageNumber - 1) * validLimitNumber;

      const { count, rows } = await User.findAndCountAll({
        where: { role },
        limit: validLimitNumber,
        offset: offset,
      });

      if (count === 0) {
        return {
          statusCode: 404,
          success: false,
          message: "Can't find users now. Please try again later.",
        };
      }

      const totalPages = Math.ceil(count / validLimitNumber);

      return {
        statusCode: 200,
        success: true,
        message: `Users found.`,
        data: rows,
        pages: {
          currentPage: validPageNumber,
          totalPages: totalPages,
          totalItems: count,
          itemsPerPage: validLimitNumber,
          hasNextPage: validPageNumber < totalPages,
          hasPrevPage: validPageNumber > 1,
        },
      };
    } catch (error) {
      logger.error(`Error getting user by role - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default GetUserService;
