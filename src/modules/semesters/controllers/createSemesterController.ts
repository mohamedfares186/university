import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import CreateSemesterSerivce from "../services/createSemesterService.js";
import { logger } from "../../../middleware/logger.js";

class CreateSemesterController {
  constructor(protected createSemesterService = new CreateSemesterSerivce()) {
    this.createSemesterService = createSemesterService;
  }

  createSemester = async (
    req: UserRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const { title, startsAt, endsAt, isActive } = req.body;
      if (!title || !startsAt || !endsAt || !isActive)
        return res
          .status(400)
          .json({ success: false, message: "All feilds are required" });

      const result = await this.createSemesterService.createSemester({
        title,
        startsAt,
        endsAt,
        isActive,
      });
      if (!result.success)
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        semester: result.semester,
      });
    } catch (error) {
      logger.error(`Error creating a new semester controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default CreateSemesterController;
