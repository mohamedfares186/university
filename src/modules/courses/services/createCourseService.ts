import BaseCreateService from "../../base/BaseCreateService.js";
import Course from "../models/coursesModel.js";

interface CreateCourseResult {
  statusCode: number;
  success: boolean;
  message: string;
  data?: Course;
}

interface ICourse {
  title: string;
  description: string;
  creditHours: number;
}

class CreateCourseService extends BaseCreateService<Course> {
  constructor() {
    super(Course, "Course");
  }

  async createCourse(course: ICourse): Promise<CreateCourseResult> {
    return await this.create(
      course,
      {
        title: { sanitize: true },
        description: { sanitize: true },
      },
      "title"
    );
  }
}

export default CreateCourseService;
