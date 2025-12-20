import { logger } from "../../../middleware/logger.js";
import BaseCreateService from "../../base/BaseCreateService.js";
import type { BaseReturnResult } from "../../base/BaseReturnResult.js";
import Faculty from "../../faculties/models/facultiesModel.js";
import Major from "../models/majorsModel.js";

interface IMajor {
  facultyId: string;
  title: string;
  description: string;
}

class CreateMajorService extends BaseCreateService<Major> {
  constructor() {
    super(Major, "Major");
  }

  async createMajor(majorData: IMajor): Promise<BaseReturnResult<Major>> {
    try {
      const faculty = await Faculty.findOne({
        where: {
          facultyId: majorData.facultyId,
        },
      });

      if (!faculty) {
        return {
          statusCode: 404,
          success: false,
          message: "Faculty not found.",
        };
      }

      const result = await this.create(
        {
          facultyId: faculty.facultyId,
          title: majorData.title,
          description: majorData.description,
        },
        {
          facultyId: { sanitize: true },
          title: { sanitize: true },
          description: { sanitize: true },
        },
        [{ title: majorData.title }]
      );
      return {
        ...result,
      };
    } catch (error) {
      logger.error(`Error creating major service - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default CreateMajorService;
