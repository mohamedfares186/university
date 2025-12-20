import type { CreateUserCredentials } from "../../../types/credentials.js";
import User from "../models/users.js";
import { logger } from "../../../middleware/logger.js";
import BaseCreateService from "../../base/BaseCreateService.js";
import type { BaseReturnResult } from "../../base/BaseReturnResult.js";

class CreateUserSerivce extends BaseCreateService<User> {
  constructor() {
    super(User, "User");
  }
  async createUser(
    userCredentials: CreateUserCredentials
  ): Promise<BaseReturnResult<User>> {
    try {
      const result = await this.create(
        userCredentials,
        {
          firstName: { sanitize: true },
          lastName: { sanitize: true },
          email: { sanitize: true },
          username: { sanitize: true },
          phoneNumber: { sanitize: true },
          address: { sanitize: true },
          gender: { sanitize: true },
          dateOfBirth: { sanitize: true },
          role: { sanitize: true },
        },
        [
          { email: userCredentials.email },
          { username: userCredentials.username },
          { phoneNumber: userCredentials.phoneNumber },
        ]
      );

      if (!result.success) {
        return {
          ...result,
        };
      }

      return {
        ...result,
      };
    } catch (error) {
      logger.error(`Error creating new user service - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Error creating new user.",
      };
    }
  }
}

export default CreateUserSerivce;
