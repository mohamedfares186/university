import BaseGetService from "../../base/BaseGetService.js";
import Course from "../models/coursesModel.js";
import type {
  PageQuery,
  BaseReturnResult,
} from "../../base/BaseReturnResult.js";

class GetCourseService extends BaseGetService<Course> {
  constructor() {
    super(Course, "Course");
  }

  async getCourses(pageQuery: PageQuery): Promise<BaseReturnResult<Course>> {
    const result = await this.getAll(pageQuery, false);
    return {
      ...result,
    };
  }
  async searchCourses(
    title: string,
    isAdmin: boolean = false,
    pageQuery?: PageQuery
  ): Promise<BaseReturnResult<Course>> {
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

export default GetCourseService;
