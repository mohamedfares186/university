import type { Request, Response } from "express";
import GetFacultyService from "../services/getFacultyService.js";
import { logger } from "../../../middleware/logger.js";

class GetFacultyController {
  constructor(protected getFacultyService = new GetFacultyService()) {
    this.getFacultyService = getFacultyService;
  }
  getFaculty = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title } = req.body;
      if (!title)
        return res
          .status(400)
          .json({ success: false, message: "Title is required." });

      const result = await this.getFacultyService.getFaculty(title);
      if (!result.success)
        return res
          .status(500)
          .json({ success: result.success, message: result.message });

      return res
        .status(200)
        .json({
          success: result.success,
          message: result.message,
          faculty: result.faculty,
        });
    } catch (error) {
      logger.error(`Error getting faculty controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}

export default GetFacultyController;
