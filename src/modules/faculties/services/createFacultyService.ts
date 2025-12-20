import Faculty from "../models/facultiesModel.js";
import BaseCreateService from "../../base/BaseCreateService.js";
import type { BaseReturnResult } from "../../base/BaseReturnResult.js";

interface IFaculty {
  title: string;
  description: string;
}

class CreateFacultyController extends BaseCreateService<Faculty> {
  constructor() {
    super(Faculty, "Faculty");
  }

  async createFaculty(data: IFaculty): Promise<BaseReturnResult<Faculty>> {
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
