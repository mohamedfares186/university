import { logger } from "../../../middleware/logger.js";
import Faculty from "../models/facultiesModel.js";

interface IFaculty {
  success: boolean;
  message: string;
  faculty?: Faculty;
}

class GetFacultyService {
  async getFaculty(title: string): Promise<IFaculty> {
    try {
      const result = await Faculty.findOne({
        where: { title },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      });
      if (!result)
        return {
          success: false,
          message: "Couldn't find this faculty. Please try again later",
        };

      return {
        success: true,
        message: "Faculty found",
        faculty: result,
      };
    } catch (error) {
      logger.error(`Error getting faculty service - ${error}`);
      return {
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default GetFacultyService;
