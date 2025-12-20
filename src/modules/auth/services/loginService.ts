import { logger } from "../../../middleware/logger.js";
import type { LoginCredentials } from "../../../types/credentials.js";
import User from "../../users/models/users.js";
import bcrypt from "bcryptjs";

interface LoginResult {
  statusCode: number;
  success: boolean;
  message: string;
  user?: User;
  userLevel?: number;
}

class LoginService {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const { username, password } = credentials;

      if (!username || !password) {
        return {
          statusCode: 400,
          success: false,
          message: "Username and password are required",
        };
      }

      const user = await User.findOne({
        where: { username },
        attributes: { include: ["password"] },
      });

      if (!user) {
        return {
          statusCode: 400,
          success: false,
          message: "Invalid credentials",
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          statusCode: 400,
          success: false,
          message: "Invalid credentials",
        };
      }

      return {
        statusCode: 200,
        success: true,
        message: "Logged in successfully",
        user,
      };
    } catch (error) {
      logger.error(`Error logging user in - ${error}`);
      return {
        statusCode: 500,
        success: false,
        message: "An error occurred during login",
      };
    }
  }
}

export default LoginService;
