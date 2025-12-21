import type { Request, Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import GetUserService from "../services/getUserService.js";
import { logger } from "../../../middleware/logger.js";

class GetUserController {
  constructor(protected getUserService = new GetUserService()) {}

  getAllUsers = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.getUserService.getAllUsers(
        {
          pageNumber,
          limit,
        },
        true
      );

      if (!result.success) {
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });
      }

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
        pages: result.pages,
      });
    } catch (error) {
      logger.error(`Error getting all users controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  getUserById = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required." });
      }

      const result = await this.getUserService.getUserById(userId);

      if (!result.success) {
        return res.status(result.statusCode).json({
          success: result.success,
          message: result.message,
        });
      }

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      logger.error(`Error getting user by Id controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  getUserByUsernameOrEmailOrOrPhoneNumber = async (
    req: UserRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const identifier =
        req.query.username || req.query.email || req.query["phone-number"];

      if (!identifier) {
        return res.status(400).json({
          success: false,
          message: "Username or Email or User ID or Phone number is required.",
        });
      }

      const result =
        await this.getUserService.getUserByUsernameOrEmailOrOrPhoneNumber(
          identifier as string
        );

      if (!result.success) {
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });
      }

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      logger.error(
        `Error getting user by username or email or user ID or phone number - ${error}`
      );
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  getUserByRole = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { role } = req.query;
      if (!role) {
        return res
          .status(400)
          .json({ success: false, message: "Role is required" });
      }

      const pageNumber = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.getUserService.getUserByRole(role as string, {
        pageNumber,
        limit,
      });

      if (!result.success) {
        return res
          .status(result.statusCode)
          .json({ success: result.success, message: result.message });
      }

      return res
        .status(result.statusCode)
        .json({
          success: result.success,
          message: result.message,
          data: result.data,
          page: result.pages,
        });
    } catch (error) {
      logger.error(`Error getting users by role controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default GetUserController;
