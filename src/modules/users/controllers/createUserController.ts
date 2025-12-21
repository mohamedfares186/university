import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import { logger } from "../../../middleware/logger.js";
import CreateUserService from "../services/createUserService.js";
import type { CreateUserCredentials } from "../../../types/credentials.js";

class CreateUserController {
  constructor(protected createUserService = new CreateUserService()) {}

  createUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const validation = this.createUserService.validateRequest(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message,
        });
      }

      const credentials = this.createUserService.extractCredentials(req.body);
      const result = await this.createUserService.createUser(
        credentials as CreateUserCredentials
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        ...(result.data && { data: result.data }),
      });
    } catch (error) {
      logger.error(`Error creating new user controller - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default CreateUserController;
