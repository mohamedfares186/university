import { logger } from "../../../middleware/logger.js";
import Faculty from "../models/facultiesModel.js";
import { v4 as uuidv4 } from "uuid";

interface CreateFacultyResult {
  success: boolean;
  message: string;
  faculty?: Faculty;
}

interface IFaculty {
  title: string;
  description: string;
}

class CreateFacultySerivce {
  async createFaculty(faculty: IFaculty): Promise<CreateFacultyResult> {
    try {
      const { title, description } = faculty;
      if (!title || !description)
        return {
          success: false,
          message: "All feilds are required.",
        };

      const facultyId = uuidv4();

      const result = await Faculty.create({
        facultyId,
        title,
        description,
      });
      if (!result)
        return {
          success: false,
          message: "Couldn't create new faculty. Please try again later.",
        };

      return {
        success: true,
        message: "Faculty has been created successfully.",
        faculty: result,
      };
    } catch (error) {
      logger.error(`Error creating new faculty service - ${error}`);
      return {
        success: false,
        message: "Internal server error.",
      };
    }
  }
}

export default CreateFacultySerivce;
