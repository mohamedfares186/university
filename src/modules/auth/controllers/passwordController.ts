import type { Request, Response } from "express";
import PasswordService from "../services/passwordService.js";
import { logger } from "../../../middleware/logger.js";

class PasswordController {
  constructor(protected passwordService = new PasswordService()) {
    this.passwordService = passwordService;
  }

  forget = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email } = req.body;

      const result = await this.passwordService.forget(email);

      if (!result.success) {
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });
      }

      return res
        .status(result.statusCode)
        .json({ success: result.success, message: result.message });
    } catch (error) {
      logger.error(`Error in forget password - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  reset = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { token } = req.params;
      const { password, repeatPassword } = req.body;

      if (!password || !repeatPassword) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (password !== repeatPassword) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
      }

      const result = await this.passwordService.reset(
        token as string,
        password
      );

      if (!result.success) {
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });
      }

      return res
        .status(result.statusCode)
        .json({ success: result.success, message: result.message });
    } catch (error) {
      logger.error(`Error in reset password - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default PasswordController;
