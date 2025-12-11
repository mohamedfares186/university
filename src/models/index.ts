// Base models first (no dependencies)
import User from "../modules/users/models/users.js";
import Faculty from "../modules/faculties/models/facultiesModel.js";
import Course from "../modules/courses/models/coursesModel.js";
import Semester from "../modules/semesters/models/semestersModel.js";

// Second level (depend on base models)
import Session from "../modules/users/models/sessions.js";
import Major from "../modules/majors/models/majorsModel.js";
import Professor from "../modules/professors/models/professorsModel.js";
import Exam from "../modules/exams/models/examsModel.js";
import Classes from "../modules/classes/models/classesModel.js";
import GPA from "../modules/gpa/models/gpaModel.js";

// Third level (depend on second level)
import MajorCourse from "../modules/courses/models/majorCoursesModel.js";
import Student from "../modules/students/models/studentsModel.js";

// Fourth level (depend on third level)
import Enrollment from "../modules/enrollment/models/enrollmentModel.js";
import Score from "../modules/scores/models/scoresModel.js";
import Attendance from "../modules/attendance/models/attendanceModel.js";

export {
  User,
  Faculty,
  Course,
  Semester,
  Session,
  Major,
  Professor,
  Exam,
  Classes,
  GPA,
  MajorCourse,
  Student,
  Enrollment,
  Score,
  Attendance,
};
