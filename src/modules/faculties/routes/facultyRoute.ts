import { Router } from "express";
import CreateFacultyController from "../controllers/createFacultyController.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import { validateCsrfToken } from "../../../middleware/csrf.js";
import authorize from "../../../middleware/isAuthorized.js";
import GetFacultyController from "../controllers/getFacultyController.js";
import requestLogger from "../../../middleware/logger.js";

const router = Router();
const getFacultyController = new GetFacultyController();

router.get("/q", requestLogger, getFacultyController.searchFaculties);
router.get("/pages", requestLogger, getFacultyController.getAllFaculties);

router.post(
  "/create-faculty",
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  requestLogger,
  new CreateFacultyController().createFaculty
);

router.get(
  "/admin/pages",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  getFacultyController.adminGetAllFaculties
);

router.get(
  "/admin/:facultyId",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  getFacultyController.adminGetFacultyById
);

export default router;
