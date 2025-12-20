import { Router } from "express";
import CreateFacultyController from "../controllers/createFacultyController.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import { validateCsrfToken } from "../../../middleware/csrf.js";
import authorize from "../../../middleware/isAuthorized.js";
import GetFacultyController from "../controllers/getFacultyController.js";
import requestLogger from "../../../middleware/logger.js";

const router = Router();

const createFacultyController = new CreateFacultyController();
const getFacultyController = new GetFacultyController();

router.get(
  "/q",
  authenticate,
  validateCsrfToken,
  requestLogger,
  getFacultyController.searchFaculties
);
router.get(
  "/pages",
  authenticate,
  validateCsrfToken,
  requestLogger,
  getFacultyController.getAllFaculties
);

router.post(
  "/admin/create-faculty",
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  requestLogger,
  createFacultyController.createFaculty
);

router.get(
  "/:facultyId",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  getFacultyController.getFacultyById
);

export default router;
