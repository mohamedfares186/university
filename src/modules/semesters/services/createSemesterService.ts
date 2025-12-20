import Semester from "../models/semestersModel.js";
import BaseCreateService from "../../base/BaseCreateService.js";
import type { BaseReturnResult } from "../../base/BaseReturnResult.js";

interface ISemester {
  title: string;
  startsAt: number;
  endsAt: number;
  isActive: boolean;
}

class CreateSemesterSerivce extends BaseCreateService<Semester> {
  constructor() {
    super(Semester, "Semester");
  }

  async createSemester(data: ISemester): Promise<BaseReturnResult<Semester>> {
    return this.create(
      data,
      {
        title: { sanitize: true },
        startsAt: { sanitize: true },
        endsAt: { sanitize: true },
      },
      "title"
    );
  }
}

export default CreateSemesterSerivce;
