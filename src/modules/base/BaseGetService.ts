/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Model,
  type ModelStatic,
  type FindAndCountOptions,
  Op,
} from "sequelize";
import { logger } from "../../middleware/logger.js";
import type { PaginationInfo, PageQuery } from "../../types/miscellaneous.js";
import sanitizeHtml from "sanitize-html";

interface BaseQueryResult<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T[];
  pages?: PaginationInfo;
}

interface SingleRecordResult<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

interface SearchOptions {
  searchFields: string[];
  includeTimestamps?: boolean;
}

abstract class BaseGetService<T extends Model> {
  protected model: ModelStatic<T>;
  protected modelName: string;

  constructor(model: ModelStatic<T>, modelName: string) {
    this.model = model;
    this.modelName = modelName;
  }

  /**
   * Getting one record with its ID
   */
  async getById(
    id: string,
    includeTimestamps: boolean
  ): Promise<SingleRecordResult<T>> {
    try {
      const queryOptions: any = {
        where: { [`${this.modelName.toLowerCase()}Id`]: id },
      };

      if (!includeTimestamps) {
        queryOptions.attributes = {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        };
      }

      const result = await this.model.findOne(queryOptions);

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
      logger.error(`${this.modelName} error getting by ID - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }

  /**
   * Getting all records with pagination
   */
  async getAll(
    pageQuery: PageQuery,
    includeTimestamps: boolean
  ): Promise<BaseQueryResult<T>> {
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

      const queryOptions: FindAndCountOptions = {
        limit: validLimitNumber,
        offset: offset,
      };

      if (!includeTimestamps) {
        queryOptions.attributes = {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        };
      }

      const { count, rows } = await this.model.findAndCountAll(queryOptions);

      if (count === 0) {
        return {
          statusCode: 404,
          success: false,
          message: `Can't find ${this.modelName.toLowerCase()} now. Please try again later.`,
        };
      }

      const totalPages = Math.ceil(count / validLimitNumber);

      return {
        statusCode: 200,
        success: true,
        message: `${this.modelName}s found.`,
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
      logger.error(
        `Error ${this.modelName.toLowerCase()} getting all items with pagination - ${error}`
      );
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }

  /**
   * Search records with optional pagination
   */
  async search(
    searchTerm: string,
    options: SearchOptions,
    pageQuery?: PageQuery
  ): Promise<BaseQueryResult<T>> {
    try {
      const sanitizedSearchTerm = sanitizeHtml(searchTerm.trim(), {
        allowedTags: [],
        allowedAttributes: {},
      });

      const escapedSearchTerm = sanitizedSearchTerm.replace(/[%_]/g, "\\$&");

      if (!escapedSearchTerm) {
        return {
          statusCode: 400,
          success: false,
          message: "Search term cannot be empty.",
        };
      }

      const searchConditions = options.searchFields.map((field) => ({
        [field]: { [Op.iLike]: `%${escapedSearchTerm}%` },
      }));

      const queryOptions: FindAndCountOptions = {
        where: { [Op.or]: searchConditions },
      };

      if (pageQuery) {
        const validPageNumber = Math.max(1, Math.floor(pageQuery.pageNumber));
        const validLimitNumber = Math.max(1, Math.floor(pageQuery.limit));
        if (validLimitNumber > 150) {
          return {
            statusCode: 400,
            success: false,
            message: "Items per page can't exceed 150.",
          };
        }
        queryOptions.limit = validLimitNumber;
        queryOptions.offset = (validPageNumber - 1) * validLimitNumber;
      }

      if (!options.includeTimestamps) {
        queryOptions.attributes = {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        };
      }

      const { count, rows } = await this.model.findAndCountAll(queryOptions);

      if (count === 0) {
        return {
          statusCode: 404,
          success: false,
          message: `${this.modelName} not found.`,
        };
      }

      const response: BaseQueryResult<T> = {
        statusCode: 200,
        success: true,
        message: `${this.modelName}${count > 1 ? "s" : ""} found`,
        data: rows,
      };

      if (pageQuery) {
        const validPageNumber = Math.max(1, Math.floor(pageQuery.pageNumber));
        const validLimitNumber = Math.max(1, Math.floor(pageQuery.limit));
        const totalPages = Math.ceil(count / validLimitNumber);

        response.pages = {
          currentPage: validPageNumber,
          totalPages: totalPages,
          totalItems: count,
          itemsPerPage: validLimitNumber,
          hasNextPage: validPageNumber < totalPages,
          hasPrevPage: validPageNumber > 1,
        };
      }

      return response;
    } catch (error) {
      logger.error(
        `Error searching ${this.modelName.toLowerCase()}s - ${error}`
      );
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default BaseGetService;
