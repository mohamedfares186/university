import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import CreateFacultyService from "../services/createFacultyService.js";
import { logger } from "../../../middleware/logger.js";

class CreateFacultyController {
  constructor(protected createFacutlyService = new CreateFacultyService()) {
    this.createFacutlyService = createFacutlyService;
  }

  createFaculty = async (
    req: UserRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const { title, description } = req.body;
      if (!title || !description)
        return res
          .status(400)
          .json({ success: false, message: "All feilds are required" });

      const result = await this.createFacutlyService.createFaculty({
        title,
        description,
      });

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(201).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      logger.error(`Error creating a new faculty controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default CreateFacultyController;
