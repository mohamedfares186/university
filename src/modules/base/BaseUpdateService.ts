/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Model, type ModelStatic, type WhereOptions } from "sequelize";
import sanitizeHtml from "sanitize-html";
import { logger } from "../../middleware/logger.js";
import type { BaseReturnResult } from "./BaseReturnResult.js";

interface SanitizationConfig {
  [key: string]: {
    sanitize: boolean;
    allowedTags?: string[];
    allowedAttributes?: { [key: string]: string[] };
  };
}

abstract class BaseUpdateService<T extends Model> {
  protected model: ModelStatic<T>;
  protected modelName: string;
  protected idField: string;

  constructor(model: ModelStatic<T>, modelName: string) {
    this.model = model;
    this.modelName = modelName;
    this.idField = `${modelName.toLowerCase()}Id`;
  }

  /**
   * Sanitize update data
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
   * Update a record by ID
   */
  async update(
    id: string,
    data: any,
    sanitizationConfig: SanitizationConfig
  ): Promise<BaseReturnResult<T>> {
    try {
      // Find existing record
      const existingRecord = await this.model.findOne({
        where: { [this.idField]: id } as WhereOptions,
      });

      if (!existingRecord) {
        return {
          statusCode: 404,
          success: false,
          message: `${this.modelName} not found.`,
        };
      }

      // Sanitize update data
      const sanitizedData = this.sanitizeData(data, sanitizationConfig);

      // Remove undefined/null values
      const cleanData = Object.fromEntries(
        Object.entries(sanitizedData).filter(
          ([, value]) => value !== undefined && value !== null
        )
      );

      // Update record
      await existingRecord.update(cleanData);

      return {
        statusCode: 200,
        success: true,
        message: `${this.modelName} updated successfully.`,
        data: existingRecord,
      };
    } catch (error) {
      logger.error(`Error updating ${this.modelName.toLowerCase()} - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }

  /**
   * Partial update (patch) - only updates provided fields
   */
  async patch(
    id: string,
    data: Partial<any>,
    sanitizationConfig: SanitizationConfig
  ): Promise<BaseReturnResult<T>> {
    return this.update(id, data, sanitizationConfig);
  }
}

export default BaseUpdateService;
