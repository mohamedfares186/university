import type { Request, Response } from "express";
import LoginService from "../services/loginService.js";
import Tokens from "../../../utils/tokens.js";
import Session from "../../users/models/sessions.js";
import environment from "../../../config/env.js";
import { logger } from "../../../middleware/logger.js";
import { v4 as uuidv4 } from "uuid";
import type { JWTCredentials } from "../../../types/credentials.js";
import { generateCsrfToken } from "../../../middleware/csrf.js";

const { env } = environment;

class LoginController {
  constructor(protected loginService = new LoginService()) {
    this.loginService = loginService;
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, password } = req.body;

      const result = await this.loginService.login({ username, password });

      if (!result.success || !result.user) {
        return res.status(result.statusCode).json({
          success: result.success,
          message: result.message,
        });
      }

      const jwtCredenetials = {
        userId: result.user.userId,
        role: result.user.role,
        isVerified: result.user.isVerified,
        isBanned: result.user.isBanned,
        isApproved: result.user.isApproved,
      };

      const accessToken = Tokens.access(jwtCredenetials as JWTCredentials);
      const refreshToken = Tokens.refresh(result.user.userId as string);
      const csrfToken = generateCsrfToken(jwtCredenetials);

      const sessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

      await Session.create({
        sessionId,
        userId: result.user.userId,
        token: refreshToken,
        expiresAt,
        isRevoked: false,
      });

      res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: env === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });

      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: env === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.cookie("x-csrf-token", csrfToken, {
        httpOnly: true,
        secure: env === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });
      res.header("x-csrf-token", csrfToken);

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      logger.error(`Error logging user in - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default LoginController;
