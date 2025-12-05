import { cookie } from "express-validator";
import error from "./validationError.js";

const refreshValidation = [
  cookie("refresh-token")
    .exists()
    .withMessage("Unauthorized")
    .isString()
    .withMessage("Refresh token must be a string"),
  error,
];

export default refreshValidation;
