import type { Request, Response } from "express";
import CreateMajorService from "../services/createMajorService.js";
import { logger } from "../../../middleware/logger.js";

class CreateMajorController {
  constructor(protected createMajorService = new CreateMajorService()) {}

  createMajor = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { facultyId, title, description } = req.body;

      if (!facultyId || !title || !description) {
        return res
          .status(400)
          .json({ success: false, message: "All feilds are required" });
      }

      const result = await this.createMajorService.createMajor({
        facultyId,
        title,
        description,
      });

      if (!result.success) {
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });
      }

      return res
        .status(result.statusCode)
        .json({
          success: result.success,
          message: result.message,
          data: result.data,
        });
    } catch (error) {
      logger.error(`Error creating major controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}
export default CreateMajorController;
