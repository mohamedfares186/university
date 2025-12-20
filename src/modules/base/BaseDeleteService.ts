import { Model, type ModelStatic, type WhereOptions } from "sequelize";
import { logger } from "../../middleware/logger.js";

interface DeleteResult {
  statusCode: number;
  success: boolean;
  message: string;
}

abstract class BaseDeleteService<T extends Model> {
  protected model: ModelStatic<T>;
  protected modelName: string;
  protected idField: string;

  constructor(model: ModelStatic<T>, modelName: string) {
    this.model = model;
    this.modelName = modelName;
    this.idField = `${modelName.toLowerCase()}Id`;
  }

  /**
   * Soft delete a record (if your model supports paranoid mode)
   */
  async softDelete(id: string): Promise<DeleteResult> {
    try {
      const record = await this.model.findOne({
        where: { [this.idField]: id } as WhereOptions<T>,
      });

      if (!record) {
        return {
          statusCode: 404,
          success: false,
          message: `${this.modelName} not found.`,
        };
      }

      await record.destroy(); // Soft delete if paranoid: true

      return {
        statusCode: 200,
        success: true,
        message: `${this.modelName} deleted successfully.`,
      };
    } catch (error) {
      logger.error(
        `Error soft deleting ${this.modelName.toLowerCase()} - ${error}`
      );
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }

  /**
   * Hard delete a record (permanent)
   */
  async hardDelete(id: string): Promise<DeleteResult> {
    try {
      const deleted = await this.model.destroy({
        where: { [this.idField]: id } as WhereOptions<T>,
        force: true, // Force delete even if paranoid
      });

      if (deleted === 0) {
        return {
          statusCode: 404,
          success: false,
          message: `${this.modelName} not found.`,
        };
      }

      return {
        statusCode: 200,
        success: true,
        message: `${this.modelName} permanently deleted.`,
      };
    } catch (error) {
      logger.error(
        `Error hard deleting ${this.modelName.toLowerCase()} - ${error}`
      );
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }

  /**
   * Bulk soft delete
   */
  async bulkSoftDelete(ids: string[]): Promise<DeleteResult> {
    try {
      const deleted = await this.model.destroy({
        where: {
          [this.idField]: ids,
        } as WhereOptions<T>,
      });

      return {
        statusCode: 200,
        success: true,
        message: `${deleted} ${this.modelName.toLowerCase()}(s) deleted successfully.`,
      };
    } catch (error) {
      logger.error(
        `Error bulk deleting ${this.modelName.toLowerCase()}s - ${error}`
      );
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default BaseDeleteService;
