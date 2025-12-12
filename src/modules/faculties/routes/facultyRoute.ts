import { Router } from "express";
import CreateFacultyController from "../controllers/createFacultyController.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import { validateCsrfToken } from "../../../middleware/csrf.js";
import authorize from "../../../middleware/isAuthorized.js";

const router = Router();

router.post(
  "/create-faculty",
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  new CreateFacultyController().createFaculty
);

export default router;
