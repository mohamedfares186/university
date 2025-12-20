// services/facultyService.ts
import BaseGetService from "../../base/BaseGetService.js";
import Faculty from "../models/facultiesModel.js";
import type {
  PageQuery,
  PaginationInfo,
} from "../../../types/miscellaneous.js";
interface FacultyQueryResult {
  statusCode: number;
  success: boolean;
  message: string;
  data?: Faculty[] | Faculty;
  pages?: PaginationInfo;
}

class GetFacultyService extends BaseGetService<Faculty> {
  constructor() {
    super(Faculty, "Faculty");
  }

  async getFacultyById(
    facultyId: string,
    isAdmin: boolean
  ): Promise<FacultyQueryResult> {
    const result = await this.getById(facultyId, isAdmin);
    return {
      ...result,
    };
  }

  async getAllFaculties(
    pageQuery: PageQuery,
    isAdmin: boolean = false
  ): Promise<FacultyQueryResult> {
    const result = await this.getAll(pageQuery, isAdmin);
    return {
      ...result,
    };
  }

  async searchFaculties(
    title: string,
    isAdmin: boolean = false,
    pageQuery?: PageQuery
  ): Promise<FacultyQueryResult> {
    const result = await this.search(
      title,
      { searchFields: ["title", "description"], includeTimestamps: isAdmin },
      pageQuery
    );
    return {
      ...result,
    };
  }
}

export default GetFacultyService;
