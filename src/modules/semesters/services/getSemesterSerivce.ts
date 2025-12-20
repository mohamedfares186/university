import Semester from "../models/semestersModel.js";
import BaseGetService from "../../base/BaseGetService.js";

import type {
  PageQuery,
  BaseReturnResult,
} from "../../base/BaseReturnResult.js";

class GetSemesterService extends BaseGetService<Semester> {
  constructor() {
    super(Semester, "Semester");
  }
  async getSemesterById(
    id: string,
    isAdmin: boolean = false
  ): Promise<BaseReturnResult<Semester>> {
    const result = await this.getById(id, isAdmin);
    return {
      ...result,
    };
  }

  async getAllSemesters(
    pageQuery: PageQuery,
    isAdmin: boolean = false
  ): Promise<BaseReturnResult<Semester>> {
    const result = await this.getAll(pageQuery, isAdmin);
    return {
      ...result,
    };
  }

  async searchSemesters(
    title: string,
    isAdmin: boolean = false,
    pageQuery?: PageQuery
  ): Promise<BaseReturnResult<Semester>> {
    const result = await this.search(
      title,
      { searchFields: ["title"], includeTimestamps: isAdmin },
      pageQuery
    );
    return {
      ...result,
    };
  }

  async adminGetAllSemesters(
    pageQuery: PageQuery,
    isAdmin: boolean = false
  ): Promise<BaseReturnResult<Semester>> {
    const result = await this.getAll(pageQuery, isAdmin);
    return {
      ...result,
    };
  }
}

export default GetSemesterService;
