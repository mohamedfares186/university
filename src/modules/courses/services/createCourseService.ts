import type { BaseReturnResult } from "../../base/BaseReturnResult.js";
import BaseCreateService from "../../base/BaseCreateService.js";
import Course from "../models/coursesModel.js";

interface ICourse {
  title: string;
  description: string;
  creditHours: number;
}

class CreateCourseService extends BaseCreateService<Course> {
  constructor() {
    super(Course, "Course");
  }

  async createCourse(course: ICourse): Promise<BaseReturnResult<Course>> {
    const result = await this.create(
      course,
      {
        title: { sanitize: true },
        description: { sanitize: true },
      },
      "title"
    );
    return {
      ...result,
    };
  }
}

export default CreateCourseService;
