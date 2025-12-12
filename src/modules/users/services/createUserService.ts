import { Op } from "sequelize";
import type { CreateUserCredentials } from "../../../types/credentials.js";
import User from "../models/users.js";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../../middleware/logger.js";
import bcrypt from "bcryptjs";

export interface CreateUserResult {
  success: boolean;
  message: string;
}

class CreateUserSerivce {
  async createUser(userCredentials: CreateUserCredentials) {
    try {
      const {
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
      } = userCredentials;

      const findUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }, { phoneNumber }],
        },
      });

      if (findUser)
        return {
          success: false,
          message: "User already exists.",
        } as CreateUserResult;

      const userId = uuidv4();
      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        userId,
        firstName,
        lastName,
        email,
        username,
        password: passwordHash,
        phoneNumber,
        address,
        gender,
        dateOfBirth,
        role,
        isVerified,
        isApproved,
        isBanned,
      });

      if (!newUser)
        return {
          success: false,
          message: "Something went wrong. Please try again later.",
        } as CreateUserResult;

      return {
        success: true,
        message: "User has been created successfully.",
      } as CreateUserResult;
    } catch (error) {
      logger.error(`Error creating new user service - ${error}`);
      return {
        success: false,
        message: "Error creating new user.",
      } as CreateUserResult;
    }
  }
}

export default CreateUserSerivce;
