import type { Request, Response } from "express";
import GetMajorService from "../services/getMajorService.js";
import { logger } from "../../../middleware/logger.js";
import type { UserRequest } from "../../../types/request.js";

class GetMajorController {
  constructor(protected getMajorService = new GetMajorService()) {}

  getAllMajors = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const isAdmin =
        req.user?.role === "admin" || req.user?.role === "super_admin";
      const result = await this.getMajorService.getAllMajors(
        {
          pageNumber,
          limit,
        },
        isAdmin
      );

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
      logger.error(`Error getting all majors - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  searchMajors = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const { q } = req.query;
      const pageNumber = Number(req.query.page);
      const limit = Number(req.query.limit) || 10;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search term is required.",
        });
      }

      const pageQuery = pageNumber ? { pageNumber, limit } : undefined;
      const isAdmin =
        req.user?.role === "admin" || req.user?.role === "super_admin";
      const result = await this.getMajorService.searchMajors(
        q as string,
        isAdmin,
        pageQuery
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
      logger.error(`Error searching majors controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  getMajorById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { majorId } = req.params;
      if (!majorId) {
        return res
          .status(400)
          .json({ success: false, message: "Major Id is required" });
      }

      const result = await this.getMajorService.getMajorById(majorId, true);
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
        });
    } catch (error) {
      logger.error(`Error getting major by ID - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default GetMajorController;
