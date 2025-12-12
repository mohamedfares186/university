import type { Request, Response } from "express";
import GetAllFacultiesService from "../services/getAllFacultiesService.js";
import { logger } from "../../../middleware/logger.js";

class GetAllFacultiesController {
  constructor(protected getAllFacultiesService = new GetAllFacultiesService()) {
    this.getAllFacultiesService = getAllFacultiesService;
  }

  getAllFaculties = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.getAllFacultiesService.getAllFaculties();
      if (!result.success)
        return res
          .status(500)
          .json({ success: result.success, message: result.message });
      return res.status(200).json({
        success: result.success,
        message: result.message,
        faculties: result.faculties,
      });
    } catch (error) {
      logger.error(`Error getting all faculties controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default GetAllFacultiesController;
