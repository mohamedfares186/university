import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import { logger } from "../../../middleware/logger.js";
import CreateUserSerivce from "../services/createUserService.js";

class CreateuserController {
  constructor(protected createUserService = new CreateUserSerivce()) {}

  createUser = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const {
        firstName,
        lastName,
        email,
        username,
        password,
        repeatPassword,
        phoneNumber,
        address,
        gender,
        dateOfBirth,
        role,
        isVerified,
        isApproved,
        isBanned,
      } = req.body;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !username ||
        !password ||
        !repeatPassword ||
        !phoneNumber ||
        !address ||
        !gender ||
        !dateOfBirth ||
        !role ||
        isVerified === undefined ||
        isApproved === undefined ||
        isBanned === undefined
      ) {
        return res
          .status(400)
          .json({ success: false, message: "All feilds are required" });
      }

      if (password !== repeatPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Passwords don't match." });
      }

      const result = await this.createUserService.createUser({
        firstName,
        lastName,
        email,
        username,
        password,
        phoneNumber,
        address,
        gender,
        dateOfBirth,
        role,
        isVerified,
        isApproved,
        isBanned,
      });

      if (!result.success) {
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });
      }

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      logger.error(`Error creating new user controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}

export default CreateuserController;
