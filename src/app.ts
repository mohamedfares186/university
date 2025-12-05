import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import requestLogger from "./middleware/logger.js";
import error from "./middleware/error.js";

import authRoute from "./modules/auth/routes/authRoute.js";
import limiter from "./middleware/limiter..js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(requestLogger as RequestHandler);
app.use(limiter as RequestHandler);

app.use("/api/v1/auth", authRoute);

app.use(error as ErrorRequestHandler);

export default app;
