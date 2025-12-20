import BaseGetService from "../../base/BaseGetService.js";
import Course from "../models/coursesModel.js";
import type {
  PageQuery,
  PaginationInfo,
} from "../../../types/miscellaneous.js";

interface CourseQueryResult {
  statusCode: number;
  success: boolean;
  message: string;
  data?: Course[];
  pages?: PaginationInfo;
}

class GetCourseService extends BaseGetService<Course> {
  constructor() {
    super(Course, "Course");
  }

  async getCourses(pageQuery: PageQuery): Promise<CourseQueryResult> {
    const result = await this.getAll(pageQuery, false);
    return {
      ...result,
    };
  }
  async searchCourses(
    title: string,
    isAdmin: boolean = false,
    pageQuery?: PageQuery
  ): Promise<CourseQueryResult> {
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
