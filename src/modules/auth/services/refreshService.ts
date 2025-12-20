import { logger } from "../../../middleware/logger.js";
import Tokens from "../../../utils/tokens.js";
import User from "../../users/models/users.js";
import Session from "../../users/models/sessions.js";
import { v4 as uuidv4 } from "uuid";

interface RefreshResult {
  statusCode: number;
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

class RefreshService {
  async refresh(userId: string, token: string): Promise<RefreshResult> {
    try {
      if (!userId || !token) {
        return {
          statusCode: 400,
          success: false,
          message: "Invalid refresh request",
        };
      }

      const session = await Session.findOne({
        where: {
          token,
          userId,
          isRevoked: false,
        },
      });

      if (!session) {
        return {
          statusCode: 400,
          success: false,
          message: "Invalid or revoked session",
        };
      }

      if (session.expiresAt < new Date()) {
        return {
          statusCode: 400,
          success: false,
          message: "Session has expired",
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

      await Session.update({ isRevoked: true }, { where: { token, userId } });

      const jwtCredentials = {
        userId: user.userId,
        role: user.role,
        isApproved: user.isApproved,
        isVerified: user.isVerified,
        isBanned: user.isBanned,
      };

      const accessToken = Tokens.access(jwtCredentials);
      const newRefreshToken = Tokens.refresh(userId as string);

      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

      const newSession = await Session.create({
        sessionId,
        userId,
        token: newRefreshToken,
        expiresAt,
        isRevoked: false,
      });

      if (!newSession) {
        return {
          statusCode: 500,
          success: false,
          message: "Failed to create new session",
        };
      }

      return {
        statusCode: 200,
        success: true,
        message: "Tokens refreshed successfully",
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error(`Error refreshing tokens - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "An error occurred while refreshing tokens",
      };
    }
  }
}

export default RefreshService;
