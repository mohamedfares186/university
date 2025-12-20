import sendEmail from "../../../utils/email.js";
import Tokens from "../../../utils/tokens.js";
import environment from "../../../config/env.js";
import bcrypt from "bcryptjs";
import User from "../../users/models/users.js";
import { logger } from "../../../middleware/logger.js";

const { secureTokenSecret, frontendUrl } = environment;

interface PasswordResult {
  statusCode: number;
  success: boolean;
  message: string;
}

class PasswordService {
  async forget(email: string): Promise<PasswordResult> {
    try {
      if (!email) {
        return {
          statusCode: 400,
          success: false,
          message: "Email is required",
        };
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return {
          statusCode: 200,
          success: true,
          message:
            "If an account exists, a reset link has been sent to your email",
        };
      }

      const token = Tokens.secure(
        user.userId as string,
        secureTokenSecret as string
      );
      const link = `${frontendUrl}/api/v1/auth/password/reset/${token}`;

      await sendEmail(
        user.email,
        "Reset your Password",
        `Click this link to reset your password: ${link}`
      );

      return {
        statusCode: 200,
        success: true,
        message:
          "If an account exists, a reset link has been sent to your email",
      };
    } catch (error) {
      logger.error(`Error sending password reset email: ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Failed to send password reset email",
      };
    }
  }

  async reset(token: string, password: string): Promise<PasswordResult> {
    try {
      if (!token) {
        return {
          statusCode: 400,
          success: false,
          message: "Reset token is required",
        };
      }

      if (!password) {
        return {
          statusCode: 400,
          success: false,
          message: "Password is required",
        };
      }

      if (password.length < 8) {
        return {
          statusCode: 400,
          success: false,
          message: "Password must be at least 8 characters long",
        };
      }

      const userId = Tokens.validate(
        token,
        secureTokenSecret as string,
        3600000
      );

      if (!userId) {
        return {
          statusCode: 400,
          success: false,
          message: "Invalid or expired reset token",
        };
      }

      const user = await User.findOne({ where: { userId } });

      if (!user) {
        return {
          statusCode: 400,
          success: false,
          message: "Invalid Credentials",
        };
      }

      const passwordHash = await bcrypt.hash(password, 12);
      user.password = passwordHash;
      await user.save();

      return {
        statusCode: 201,
        success: true,
        message: "Password has been reset successfully",
      };
    } catch (error) {
      logger.error(`Error resetting password: ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Failed to reset password",
      };
    }
  }
}

export default PasswordService;
