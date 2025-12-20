// services/facultyService.ts
import BaseGetService from "../../base/BaseGetService.js";
import Faculty from "../models/facultiesModel.js";
import type {
  PageQuery,
  BaseReturnResult,
} from "../../base/BaseReturnResult.js";
class GetFacultyService extends BaseGetService<Faculty> {
  constructor() {
    super(Faculty, "Faculty");
  }

  async getFacultyById(
    facultyId: string,
    isAdmin: boolean
  ): Promise<BaseReturnResult<Faculty>> {
    const result = await this.getById(facultyId, isAdmin);
    return {
      ...result,
    };
  }

  async getAllFaculties(
    pageQuery: PageQuery,
    isAdmin: boolean = false
  ): Promise<BaseReturnResult<Faculty>> {
    const result = await this.getAll(pageQuery, isAdmin);
    return {
      ...result,
    };
  }

  async searchFaculties(
    title: string,
    isAdmin: boolean = false,
    pageQuery?: PageQuery
  ): Promise<BaseReturnResult<Faculty>> {
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
