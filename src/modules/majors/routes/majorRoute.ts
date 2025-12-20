import { Router } from "express";
import authenticate from "../../../middleware/isAuthenticated.js";
import { validateCsrfToken } from "../../../middleware/csrf.js";
import authorize from "../../../middleware/isAuthorized.js";
import requestLogger from "../../../middleware/logger.js";

import CreateMajorController from "../controllers/createMajorController.js";
import GetMajorController from "../controllers/getMajorController.js";

const router = Router();

const createMajorController = new CreateMajorController();
const getMajorController = new GetMajorController();

router.get(
  "/search/q",
  authenticate,
  validateCsrfToken,
  requestLogger,
  getMajorController.searchMajors
);
router.get(
  "/pages",
  authenticate,
  validateCsrfToken,
  requestLogger,
  getMajorController.getAllMajors
);

router.post(
  "/admin/create-major",
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  requestLogger,
  createMajorController.createMajor
);

router.get(
  "/:majorId",
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  requestLogger,
  getMajorController.getMajorById
);

export default router;
