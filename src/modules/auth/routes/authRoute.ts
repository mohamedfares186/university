import { Router, type RequestHandler } from "express";
// import type { RequestHandler } from "express";
import RegisterController from "../controllers/registerController.js";
import LoginController from "../controllers/loginController.js";
import LogoutController from "../controllers/logoutController.js";
import RefreshController from "../controllers/refreshController.js";
import EmailController from "../controllers/emailController.js";
import PasswordController from "../controllers/passwordController.js";
import authenticate from "../../../middleware/isAuthenticated.js";
import registerValidation from "../validation/registerValidation.js";
import loginValidation from "../validation/loginValidation.js";
import logoutValidation from "../validation/logoutValidation.js";
import refreshValidation from "../validation/refreshValidation.js";
import emailVerificationValidation from "../validation/emailValidation.js";
import {
  forgetPasswordValidation,
  resetPasswordValidation,
} from "../validation/passwordValidation.js";
// import requestLogger from "../../../middleware/logger.js";
import { authLimiter } from "../../../middleware/limiter..js";
import requestLogger from "../../../middleware/logger.js";

const router = Router();

const email = new EmailController();
const password = new PasswordController();

router.post(
  "/register",
  authLimiter,
  registerValidation,
  requestLogger as RequestHandler,
  new RegisterController().register
);
router.post(
  "/login",
  authLimiter,
  loginValidation,
  requestLogger as RequestHandler,
  new LoginController().login
);
router.post(
  "/logout",
  authLimiter,
  logoutValidation,
  authenticate,
  requestLogger as RequestHandler,
  new LogoutController().logout
);
router.post(
  "/refresh",
  authLimiter,
  refreshValidation,
  authenticate,
  requestLogger as RequestHandler,
  new RefreshController().refresh
);
router.post("/email/resend", authLimiter, authenticate, email.resend);
router.post(
  "/email/verify/:token",
  authLimiter,
  emailVerificationValidation,
  requestLogger as RequestHandler,
  email.verify
);
router.post(
  "/password/forget",
  authLimiter,
  forgetPasswordValidation,
  requestLogger as RequestHandler,
  password.forget
);
router.post(
  "/password/reset/:token",
  authLimiter,
  resetPasswordValidation,
  requestLogger as RequestHandler,
  password.reset
);

export default router;
