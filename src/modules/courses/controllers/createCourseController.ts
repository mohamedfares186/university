import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import CreateCourseService from "../services/createCourseService.js";
import { logger } from "../../../middleware/logger.js";

class CreateCourseController {
  constructor(protected createCourseService = new CreateCourseService()) {}

  createCourse = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const { title, description, creditHours } = req.body;

      const result = await this.createCourseService.createCourse({
        title,
        description,
        creditHours,
      });

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      logger.error(`Error creating new course controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default CreateCourseController;
