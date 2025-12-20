import Tokens from "../../../utils/tokens.js";
import environment from "../../../config/env.js";
import { logger } from "../../../middleware/logger.js";
import RegisterService from "../services/registerService.js";
import type { Request, Response } from "express";
import type {
  JWTCredentials,
  RegisterCredentials,
} from "../../../types/credentials.js";
import { v4 as uuidv4 } from "uuid";
import Session from "../../users/models/sessions.js";
import { generateCsrfToken } from "../../../middleware/csrf.js";

const { env } = environment;

class RegisterController {
  constructor(protected registerService = new RegisterService()) {
    this.registerService = registerService;
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {
        firstName,
        lastName,
        email,
        username,
        password,
        repeatPassword,
        dateOfBirth,
        phoneNumber,
        address,
        gender,
      } = req.body;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !username ||
        !password ||
        !repeatPassword ||
        !dateOfBirth ||
        !phoneNumber ||
        !address ||
        !gender
      )
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });

      if (password !== repeatPassword)
        return res
          .status(400)
          .json({ success: false, message: "Passwords don't match" });

      const result = await this.registerService.register({
        firstName,
        lastName,
        email,
        username,
        password,
        dateOfBirth,
        phoneNumber,
        gender,
        address,
      } as RegisterCredentials);

      if (!result.success || !result.user) {
        return res.status(result.statusCode).json({
          success: false,
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

      try {
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        const newSession = await Session.create({
          sessionId,
          userId: result.user?.userId,
          token: refreshToken,
          isRevoked: false,
          expiresAt,
        });

        if (!newSession) {
          return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
          });
        }
      } catch (sessionError) {
        logger.error(`Failed to create session for new user - ${sessionError}`);
      }

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
        success: true,
        message: result.message,
      });
    } catch (error) {
      logger.error(`Error in register controller - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}

export default RegisterController;
