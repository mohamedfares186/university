import { Router } from "express";
import CreateuserController from "../controllers/createUserController.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import { validateCsrfToken } from "../../../middleware/csrf.js";
import authorize from "../../../middleware/isAuthorized.js";

const router = Router();

router.post(
  "/admin/create-user",
  authenticate,
  validateCsrfToken,
  authorize("super_admin", "admin"),
  new CreateuserController().createUser
);

export default router;
