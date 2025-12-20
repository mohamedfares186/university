import type { Request, Response } from "express";
import { logger } from "../../../middleware/logger.js";
import GetCourseService from "../services/getCourseService.js";

class GetCourseController {
  constructor(protected getCourseSerivce = new GetCourseService()) {
    this.getCourseSerivce = getCourseSerivce;
  }

  getCourses = async (req: Request, res: Response): Promise<Response> => {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.getCourseSerivce.getCourses({
        pageNumber,
        limit,
      });

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        course: result.data,
        pages: result.pages,
      });
    } catch (error) {
      logger.error(`Error getting all courses controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };

  searchCourses = async (req: Request, res: Response): Promise<Response> => {
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
      const result = await this.getCourseSerivce.searchCourses(
        q as string,
        false,
        pageQuery
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        course: result.data,
      });
    } catch (error) {
      logger.error(`Error searching courses controller - ${error}`);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  };
}

export default GetCourseController;
