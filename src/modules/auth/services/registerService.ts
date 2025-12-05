import { logger } from "../../../middleware/logger.js";
import { v4 as uuidv4, type UUIDTypes } from "uuid";
import bcrypt from "bcryptjs";
import Tokens from "../../../utils/tokens.js";
import sendEmail from "../../../utils/email.js";
import environment from "../../../config/env.js";
import type {
  UserCredentials,
  RegisterCredentials,
} from "../../../types/credentials.js";
import User from "../../users/models/users.js";

const { secureTokenSecret, frontendUrl } = environment;

interface RegisterResult {
  success: boolean;
  message: string;
  user?: UserCredentials;
  emailSent?: boolean;
}

class RegisterService {
  async register(credentials: RegisterCredentials): Promise<RegisterResult> {
    try {
      const {
        firstName,
        lastName,
        email,
        username,
        password,
        dateOfBirth,
        phoneNumber,
        address,
        gender,
      } = credentials;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !username ||
        !password ||
        !dateOfBirth
      ) {
        return {
          success: false,
          message: "All fields are required",
        };
      }

      if (password.length < 8) {
        return {
          success: false,
          message: "Password must be at least 8 characters long",
        };
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const userId: UUIDTypes = uuidv4();

      const newUser: User = await User.create({
        userId,
        firstName,
        lastName,
        email,
        username,
        password: passwordHash,
        dateOfBirth,
        phoneNumber,
        address,
        gender,
        role: "student",
        isVerified: false,
        isBanned: false,
        isApproved: false,
      });

      if (!newUser) {
        return {
          success: false,
          message: "Failed to create user account",
        };
      }

      let emailSent = false;
      try {
        const token = Tokens.secure(
          userId as string,
          secureTokenSecret as string
        );
        const link = `${frontendUrl}/api/v1/auth/email/verify/${token}`;

        await sendEmail(
          email,
          "Verify your Email",
          `Click this link to verify your email: ${link}`
        );
        emailSent = true;
      } catch (emailError) {
        logger.error(
          `Failed to send verification email to ${email}: ${emailError}`
        );
      }

      return {
        success: true,
        message: emailSent
          ? "Registration successful. Please check your email to verify your account."
          : "Registration successful, but we couldn't send the verification email. Please request a new one.",
        user: newUser,
      };
    } catch (error) {
      logger.error(`Error during user registration - ${error}`);
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  }
}

export default RegisterService;
