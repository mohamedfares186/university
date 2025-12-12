import { Router, type RequestHandler } from "express";
import CreateuserController from "../controllers/createUserController.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import { validateCsrfToken } from "../../../middleware/csrf.js";
import authorize from "../../../middleware/isAuthorized.js";
import requestLogger from "../../../middleware/logger.js";
import GetUserController from "../controllers/getUserController.js";
import GetAllUsersController from "../controllers/getAllUsersController.js";
import ApproveUserController from "../controllers/approveUserController.js";
import BanUserController from "../controllers/banUserController.js";

const router = Router();

router.post(
  "/admin/create-user",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger as RequestHandler,
  new CreateuserController().createUser
);

router.post(
  "/admin/get-user",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger as RequestHandler,
  new GetUserController().getUser
);

router.get(
  "/admin/all-users",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger as RequestHandler,
  new GetAllUsersController().getAllUsers
);

router.post(
  "/admin/approve-user",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger as RequestHandler,
  new ApproveUserController().approveUser
);

router.post(
  "/admin/ban-user",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger as RequestHandler,
  new BanUserController().banUser
);

export default router;
