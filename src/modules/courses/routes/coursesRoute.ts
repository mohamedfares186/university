import { Router } from "express";
import CreateCourseController from "../controllers/createCourseController.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import { validateCsrfToken } from "../../../middleware/csrf.js";
import authorize from "../../../middleware/isAuthorized.js";
import GetCourseController from "../controllers/getCourseController.js";
import requestLogger from "../../../middleware/logger.js";

const router = Router();

const getCourseController = new GetCourseController();

router.get("/q", requestLogger, getCourseController.searchCourses);
router.get("/pages", requestLogger, getCourseController.getCourses);

router.post(
  "/create-course",
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  requestLogger,
  new CreateCourseController().createCourse
);

export default router;
