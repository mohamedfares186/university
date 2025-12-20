import Faculty from "../models/facultiesModel.js";
import BaseCreateService from "../../base/BaseCreateService.js";

interface CreateFacultyResult {
  success: boolean;
  message: string;
  faculty?: Faculty;
}

interface IFaculty {
  title: string;
  description: string;
}

class CreateFacultyController extends BaseCreateService<Faculty> {
  constructor() {
    super(Faculty, "Faculty");
  }

  async createFaculty(data: IFaculty): Promise<CreateFacultyResult> {
    return this.create(
      data,
      {
        title: { sanitize: true },
        description: { sanitize: true },
      },
      "title"
    );
  }
}

export default CreateFacultyController;
