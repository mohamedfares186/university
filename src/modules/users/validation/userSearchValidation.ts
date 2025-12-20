import { query } from "express-validator";
import error from "./validationError.js";

const userSearchValidation = [
  query("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 4, max: 30 })
    .withMessage("Username must be between 4 and 30 characters")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage("Username may contain only letters, numbers and underscore"),
  error,
];

export default userSearchValidation;
