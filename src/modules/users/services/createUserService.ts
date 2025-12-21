import type { CreateUserCredentials } from "../../../types/credentials.js";
import User from "../models/users.js";
import { logger } from "../../../middleware/logger.js";
import type { SingleReturnResult } from "../../base/BaseReturnResult.js";
import Professor from "../../professors/models/professorsModel.js";
import { v4 as uuidv4 } from "uuid";
import Student from "../../students/models/studentsModel.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

class CreateUserService {
  async createUser(
    credentials: CreateUserCredentials
  ): Promise<SingleReturnResult<User>> {
    try {
      const conflict = await this.checkConflicts(credentials);
      if (conflict) return conflict;

      const userId = uuidv4();
      const passwordHash = await bcrypt.hash(credentials.password, 12);

      const user = await User.create({
        ...credentials,
        userId,
        password: passwordHash,
      });

      if (!user) {
        return {
          statusCode: 500,
          success: false,
          message:
            "Can't create this user at the moment. Please try again later",
        };
      }

      await this.createRoleRecord(user.userId, credentials);

      const userData = user.get({ plain: true });
      delete userData.password;

      return {
        statusCode: 201,
        success: true,
        message: "New user has been created successfully",
        data: userData,
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

  private async checkConflicts(
    credentials: CreateUserCredentials
  ): Promise<SingleReturnResult<User> | null> {
    const { email, username, phoneNumber } = credentials;

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }, { phoneNumber }] },
    });

    if (!existingUser) return null;

    const conflicts = {
      email: "Email already exists",
      username: "Username already exists",
      phoneNumber: "Phone number already exists",
    };

    for (const [field, message] of Object.entries(conflicts)) {
      if (
        existingUser.dataValues[field] ===
        credentials[field as keyof CreateUserCredentials]
      ) {
        return { statusCode: 409, success: false, message };
      }
    }

    return null;
  }

  private async createRoleRecord(
    userId: string,
    credentials: CreateUserCredentials
  ): Promise<void> {
    const { role, courseId, majorId } = credentials;

    try {
      if (courseId && (role === "professor" || role === "teaching_assistant")) {
        await Professor.create({
          professorId: uuidv4(),
          userId,
          courseId,
          title: role,
        });
        logger.info(`Professor user has been created successfully`);
      } else if (majorId && role === "student") {
        await Student.create({
          studentId: uuidv4(),
          userId,
          majorId,
        });
        logger.info(`Student user has been created successfully`);
      }
    } catch (error) {
      logger.error(`Error creating ${role} record - ${error}`);
    }
  }

  validateRequest(body: CreateUserCredentials): {
    valid: boolean;
    message?: string;
  } {
    const required = [
      "firstName",
      "lastName",
      "email",
      "username",
      "password",
      "repeatPassword",
      "phoneNumber",
      "address",
      "gender",
      "dateOfBirth",
      "role",
    ];

    const missing = required.filter(
      (field) => !body[field as keyof CreateUserCredentials]
    );
    if (missing.length > 0) {
      return { valid: false, message: "All fields are required" };
    }

    if (
      body.isVerified === undefined ||
      body.isApproved === undefined ||
      body.isBanned === undefined
    ) {
      return { valid: false, message: "All fields are required" };
    }

    if (body.password !== body.repeatPassword) {
      return { valid: false, message: "Passwords don't match." };
    }

    return { valid: true };
  }

  extractCredentials(body: CreateUserCredentials) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { repeatPassword, ...credentials } = body;
    return {
      ...credentials,
      majorId: body.majorId || undefined,
      courseId: body.courseId || undefined,
    };
  }
}

export default CreateUserService;
