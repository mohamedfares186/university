import Semester from "../models/semestersModel.js";
import BaseGetService from "../../base/BaseGetService.js";

import type {
  PageQuery,
  PaginationInfo,
} from "../../../types/miscellaneous.js";

interface GetSemesterResult {
  statusCode: number;
  success: boolean;
  message: string;
  data?: Semester[] | Semester;
  pages?: PaginationInfo;
}

class GetSemesterService extends BaseGetService<Semester> {
  constructor() {
    super(Semester, "Semester");
  }
  async getSemesterById(
    id: string,
    isAdmin: boolean = false
  ): Promise<GetSemesterResult> {
    const result = await this.getById(id, isAdmin);
    return {
      ...result,
    };
  }

  async getAllSemesters(
    pageQuery: PageQuery,
    isAdmin: boolean = false
  ): Promise<GetSemesterResult> {
    const result = await this.getAll(pageQuery, isAdmin);
    return {
      ...result,
    };
  }

  async searchSemesters(
    title: string,
    isAdmin: boolean = false,
    pageQuery?: PageQuery
  ): Promise<GetSemesterResult> {
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
  ): Promise<GetSemesterResult> {
    const result = await this.getAll(pageQuery, isAdmin);
    return {
      ...result,
    };
  }

  async adminSearchSemesters(
    title: string,
    isAdmin: boolean = false,
    pageQuery?: PageQuery
  ): Promise<GetSemesterResult> {
    const result = await this.search(
      title,
      { searchFields: ["title"], includeTimestamps: isAdmin },
      pageQuery
    );
    return {
      ...result,
    };
  }
}

export default GetSemesterService;
