import BaseGetService from "../../base/BaseGetService.js";
import type {
  BaseReturnResult,
  PageQuery,
} from "../../base/BaseReturnResult.js";
import Major from "../models/majorsModel.js";

class GetMajorService extends BaseGetService<Major> {
  constructor() {
    super(Major, "Major");
  }

  async getAllMajors(
    pageQuery: PageQuery,
    isAdmin: boolean = false
  ): Promise<BaseReturnResult<Major>> {
    const result = await this.getAll(pageQuery, isAdmin);
    return {
      ...result,
    };
  }

  async searchMajors(
    title: string,
    isAdmin: boolean = false,
    pageQuery?: PageQuery
  ): Promise<BaseReturnResult<Major>> {
    const result = await this.search(
      title,
      { searchFields: ["title", "description"], includeTimestamps: isAdmin },
      pageQuery
    );
    return {
      ...result,
    };
  }

  async getMajorById(
    id: string,
    isAdmin: boolean = false
  ): Promise<BaseReturnResult<Major>> {
    const result = await this.getById(id, isAdmin);
    return {
      ...result,
    };
  }
}

export default GetMajorService;
