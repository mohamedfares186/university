import type { Request, Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import GetFacultyService from "../services/getFacultyService.js";
import { logger } from "../../../middleware/logger.js";

class GetFacultyController {
  constructor(private getFacultyService = new GetFacultyService()) {}

  getAllFaculties = async (req: Request, res: Response): Promise<Response> => {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.getFacultyService.getAllFaculties(
        { pageNumber, limit },
        false
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
        pages: result.pages,
      });
    } catch (error) {
      logger.error(`Error in get all faculties controller - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };

  adminGetAllFaculties = async (
    req: UserRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.getFacultyService.getAllFaculties(
        { pageNumber, limit },
        true
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
        pages: result.pages,
      });
    } catch (error) {
      logger.error(
        `Error in admin getting all faculties controller - ${error}`
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };

  searchFaculties = async (req: Request, res: Response): Promise<Response> => {
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
      const result = await this.getFacultyService.searchFaculties(
        q as string,
        false,
        pageQuery
      );

      return res.status(result.statusCode).json(result);
    } catch (error) {
      logger.error(`Error in searching faculties controller - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };

  adminGetFacultyById = async (
    req: UserRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const facultyId = req.params.facultyId;

      if (!facultyId) {
        return res.status(400).json({
          success: false,
          message: "Faculty ID is required.",
        });
      }

      const result = await this.getFacultyService.getFacultyById(
        facultyId,
        true
      );
      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      logger.error(
        `Error in admin getting faculty by ID controller - ${error}`
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
}

export default GetFacultyController;
