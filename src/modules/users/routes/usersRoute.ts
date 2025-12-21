import { Router } from "express";
import authenticate from "../../../middleware/isAuthenticated.js";
import { validateCsrfToken } from "../../../middleware/csrf.js";
import authorize from "../../../middleware/isAuthorized.js";
import requestLogger from "../../../middleware/logger.js";

import CreateuserController from "../controllers/createUserController.js";
import GetUserController from "../controllers/getUserController.js";
import DeleteUserController from "../controllers/deleteUserController.js";
import UpdateUserController from "../controllers/updateUserController.js";

import createUserValidation from "../validation/createUserValidation.js";
import userSearchValidation from "../validation/userSearchValidation.js";

const router = Router();
const createUserController = new CreateuserController();
const getUserController = new GetUserController();
const deleteUserController = new DeleteUserController();
const updateUserController = new UpdateUserController();

router.post(
  "/admin/create-user",
  createUserValidation,
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  createUserController.createUser
);

router.get(
  "/admin/pages",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  getUserController.getAllUsers
);

router.get(
  "/admin/search/q",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  getUserController.getUserByUsernameOrEmailOrOrPhoneNumber
);

router.get(
  "/admin/:userId",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  getUserController.getUserById
);
router.get(
  "/admin/q",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  getUserController.getUserByRole
);

router.delete(
  "/admin/delete",
  userSearchValidation,
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  requestLogger,
  deleteUserController.softDelete
);

router.put(
  "/admin/approve",
  authenticate,
  validateCsrfToken,
  authorize("super_admin"),
  requestLogger,
  updateUserController.approveUser
);

router.put(
  "/admin/ban",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  requestLogger,
  updateUserController.banUser
);

export default router;
