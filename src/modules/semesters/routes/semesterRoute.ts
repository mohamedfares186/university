import { Router } from "express";
import CreateSemesterController from "../controllers/createSemesterController.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import { validateCsrfToken } from "../../../middleware/csrf.js";
import authorize from "../../../middleware/isAuthorized.js";
import GetSemesterController from "../controllers/getSemesterController.js";
import requestLogger from "../../../middleware/logger.js";

const router = Router();

const getSemesterController = new GetSemesterController();

router.get("/q", requestLogger, getSemesterController.searchSemesters);
router.get("/pages", requestLogger, getSemesterController.getAllSemesters);

router.post(
  "/create-semester",
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  requestLogger,
  new CreateSemesterController().createSemester
);
router.get(
  "/q",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  getSemesterController.adminSearchSemesters
);
router.get(
  "/pages",
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  requestLogger,
  getSemesterController.adminGetAllSemesters
);

export default router;
