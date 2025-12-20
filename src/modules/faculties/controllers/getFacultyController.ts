import type { Response } from "express";
import type { UserRequest } from "../../../types/request.js";
import GetFacultyService from "../services/getFacultyService.js";
import { logger } from "../../../middleware/logger.js";

class GetFacultyController {
  constructor(private getFacultyService = new GetFacultyService()) {}

  getAllFaculties = async (
    req: UserRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const isAdmin =
        req.user?.role === "admin" || req.user?.role === "super_admin";
      const result = await this.getFacultyService.getAllFaculties(
        { pageNumber, limit },
        isAdmin
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

  searchFaculties = async (
    req: UserRequest,
    res: Response
  ): Promise<Response> => {
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
      const result = await this.getFacultyService.searchFaculties(
        q as string,
        isAdmin,
        pageQuery
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
      logger.error(`Error in searching faculties controller - ${error}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };

  getFacultyById = async (
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
      const isAdmin =
        req.user?.role === "admin" || req.user?.role === "super_admin";
      const result = await this.getFacultyService.getFacultyById(
        facultyId,
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
