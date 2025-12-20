import GetSemesterService from "../services/getSemesterSerivce.js";
import type { Request, Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import { logger } from "../../../middleware/logger.js";

class GetSemesterController {
  constructor(protected getSemesterService = new GetSemesterService()) {}

  getAllSemesters = async (
    req: UserRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const isAdmin =
        req.user?.role === "admin" || req.user?.role === "super_admin";
      const result = await this.getSemesterService.getAllSemesters(
        {
          pageNumber,
          limit,
        },
        isAdmin
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
      logger.error(`Error getting all semesters controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  searchSemesters = async (
    req: UserRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const { q } = req.query;
      const pageNumber = Number(req.query.page);
      const limit = Number(req.query.limit);

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search term is required.",
        });
      }

      const pageQuery = pageNumber ? { pageNumber, limit } : undefined;
      const isAdmin =
        req.user?.role === "admin" || req.user?.role === "super_admin";
      const result = await this.getSemesterService.searchSemesters(
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
        pages: result.pages,
      });
    } catch (error) {
      logger.error(`Error searching semesters controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  getSemesterById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { semesterId } = req.params;

      if (!semesterId) {
        return res
          .status(400)
          .json({ success: false, message: "Semester ID is required." });
      }

      const result = await this.getSemesterService.getSemesterById(
        semesterId,
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
      });
    } catch (error) {
      logger.error(`Error getting semester by ID controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}

export default GetSemesterController;
