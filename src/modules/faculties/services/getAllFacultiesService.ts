import { logger } from "../../../middleware/logger.js";
import Faculty from "../models/facultiesModel.js";

interface IFaculties {
  success: boolean;
  message: string;
  faculties?: Faculty[];
}

class GetAllFacultiesService {
  async getAllFaculties(): Promise<IFaculties> {
    try {
      const result = await Faculty.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      });
      if (!result)
        return {
          success: false,
          message: "Couldn't find faculties. please try again later.",
        };

      return {
        success: true,
        message: "Faculties found",
        faculties: result,
      };
    } catch (error) {
      logger.error(`Error getting all faculties - ${error}`);
      return {
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default GetAllFacultiesService;
