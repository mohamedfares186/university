import "dotenv/config";
import AdminUser from "./initializeAdmin.js";
import { logger } from "../middleware/logger.js";
import sequelize, { connectDB } from "../config/db.js";
import "../models/index.js";

const admin = new AdminUser();

try {
  await connectDB();
  await admin.Run();
  await sequelize.close();
} catch (error) {
  logger.error(error);
  throw error;
}
