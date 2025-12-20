import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import error from "./middleware/error.js";
import limiter from "./middleware/limiter..js";

import authRoute from "./modules/auth/routes/authRoute.js";
import usersRoute from "./modules/users/routes/usersRoute.js";
import facultiesRoute from "./modules/faculties/routes/facultyRoute.js";
import coursesRoute from "./modules/courses/routes/coursesRoute.js";
import semesterRoute from "./modules/semesters/routes/semesterRoute.js";
import majorRoute from "./modules/majors/routes/majorRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(limiter as RequestHandler);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/faculties", facultiesRoute);
app.use("/api/v1/courses", coursesRoute);
app.use("/api/v1/semesters", semesterRoute);
app.use("/api/v1/majors", majorRoute);

app.use(error as ErrorRequestHandler);

export default app;
