import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import { logger } from "../../../middleware/logger.js";
import CreateUserSerivce from "../services/createUserService.js";

class CreateuserController {
  constructor(protected user = new CreateUserSerivce()) {
    this.user = user;
  }

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
        isVerified === null ||
        isApproved === null ||
        isBanned === null
      )
        return res
          .status(400)
          .json({ success: false, message: "All feilds are requried." });

      if (password !== repeatPassword)
        return res
          .status(400)
          .json({ success: false, message: "Passwords don't match." });

      const result = await this.user.createUser({
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

      if (!result.success)
        return res
          .status(500)
          .json({ success: result.success, message: result.message });

      return res
        .status(201)
        .json({ success: result.success, message: result.message });
    } catch (error) {
      logger.error(`Error creating new user controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}

export default CreateuserController;
