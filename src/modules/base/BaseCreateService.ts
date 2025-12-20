/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Model, Op, type ModelStatic } from "sequelize";
import sanitizeHtml from "sanitize-html";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../middleware/logger.js";
import type { BaseReturnResult } from "./BaseReturnResult.js";

interface SanitizationConfig {
  [key: string]: {
    sanitize: boolean;
    allowedTags?: string[];
    allowedAttributes?: { [key: string]: string[] };
  };
}

abstract class BaseCreateService<T extends Model> {
  protected model: ModelStatic<T>;
  protected modelName: string;
  protected idField: string;

  constructor(model: ModelStatic<T>, modelName: string) {
    this.model = model;
    this.modelName = modelName;
    this.idField = `${modelName.toLowerCase()}Id`;
  }

  /**
   * Sanitize input data based on configuration
   */
  protected sanitizeData(data: any, config: SanitizationConfig): any {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (config[key]?.sanitize && typeof value === "string") {
        sanitized[key] = sanitizeHtml(value, {
          allowedTags: config[key].allowedTags || [],
          allowedAttributes: config[key].allowedAttributes || {},
        });
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Check if a record already exists
   */
  protected async checkExists(whereClause: any): Promise<T | null> {
    try {
      return await this.model.findOne({
        where: {
          [Op.or]: [whereClause],
        },
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      });
    } catch (error) {
      logger.error(`Error checking ${this.modelName} existence - ${error}`);
      return null;
    }
  }

  /**
   * Create a new record
   */
  async create(
    data: any,
    sanitizationConfig: SanitizationConfig,
    uniqueField?: any
  ): Promise<BaseReturnResult<T>> {
    try {
      // Sanitize input
      const sanitizedData = this.sanitizeData(data, sanitizationConfig);

      // Check if record already exists (if uniqueField provided)
      if (uniqueField && sanitizedData[uniqueField]) {
        const existing = await this.checkExists(uniqueField);

        if (existing) {
          return {
            statusCode: 409,
            success: false,
            message: `${this.modelName} with this ${uniqueField} already exists.`,
            data: existing,
          };
        }
      }

      // Generate ID
      const recordId = uuidv4();

      // Create record
      const result = await this.model.create({
        [this.idField]: recordId,
        ...sanitizedData,
      });

      if (!result) {
        return {
          statusCode: 500,
          success: false,
          message: `Couldn't create ${this.modelName.toLowerCase()}. Please try again later.`,
        };
      }

      return {
        statusCode: 201,
        success: true,
        message: `${this.modelName} has been created successfully.`,
        data: result,
      };
    } catch (error) {
      logger.error(`Error creating ${this.modelName.toLowerCase()} - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }

  /**
   * Bulk create records
   */
  async bulkCreate(
    dataArray: any[],
    sanitizationConfig: SanitizationConfig
  ): Promise<BaseReturnResult<T>> {
    try {
      const sanitizedDataArray = dataArray.map((data) => {
        const sanitized = this.sanitizeData(data, sanitizationConfig);
        return {
          [this.idField]: uuidv4(),
          ...sanitized,
        };
      });

      const results = await this.model.bulkCreate(sanitizedDataArray);

      return {
        statusCode: 201,
        success: true,
        message: `${
          results.length
        } ${this.modelName.toLowerCase()}s created successfully.`,
        data: results as any,
      };
    } catch (error) {
      logger.error(
        `Error bulk creating ${this.modelName.toLowerCase()}s - ${error}`
      );
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default BaseCreateService;
