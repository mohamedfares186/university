import sendEmail from "../../../utils/email.js";
import Tokens from "../../../utils/tokens.js";
import environment from "../../../config/env.js";
import User from "../../users/models/users.js";
import type { UUIDTypes } from "uuid";
import { logger } from "../../../middleware/logger.js";

const { secureTokenSecret, frontendUrl } = environment;

interface EmailVerificationResult {
  statusCode: number;
  success: boolean;
  message: string;
}

class EmailService {
  async send(
    userId: UUIDTypes,
    email: string
  ): Promise<EmailVerificationResult> {
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

      return {
        statusCode: 200,
        success: true,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      logger.error(`Error sending verification email - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Failed to send verification email",
      };
    }
  }

  async verify(token: string): Promise<EmailVerificationResult> {
    try {
      const userId = Tokens.validate(
        token,
        secureTokenSecret as string,
        36000000
      );

      if (!userId) {
        return {
          statusCode: 400,
          success: false,
          message: "Invalid or expired token",
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

      if (user.isVerified === true) {
        return {
          statusCode: 400,
          success: false,
          message: "Email is already verified",
        };
      }

      user.isVerified = true;
      await user.save();

      return {
        statusCode: 200,
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      logger.error(`Error verifying email - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "An error occurred during email verification",
      };
    }
  }

  async resend(userId: UUIDTypes): Promise<EmailVerificationResult> {
    try {
      const user = await User.findOne({ where: { userId } });

      if (!user) {
        return {
          statusCode: 400,
          success: false,
          message: "Invalid Credentials",
        };
      }

      if (user.isVerified) {
        return {
          statusCode: 400,
          success: false,
          message: "Email is already verified",
        };
      }

      return await this.send(userId, user.email);
    } catch (error) {
      logger.error(`Error resending verification email - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "Failed to resend verification email",
      };
    }
  }
}

export default EmailService;
