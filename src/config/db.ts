import { Sequelize } from "sequelize";
import { logger } from "../middleware/logger.js";
import environment from "./env.js";

const { env, databaseUrl } = environment;

const PRODUCTION: boolean = env === "production" && !!databaseUrl;
const STAGING: boolean = env === "staging" && !!databaseUrl;
const DEVELOPMENT: boolean = env === "development" && !!databaseUrl;
const TEST: boolean = env === "test";

const sequelize =
  PRODUCTION || STAGING || DEVELOPMENT
    ? new Sequelize(databaseUrl as string, {
        dialect: "postgres",
        logging: true,
      })
    : new Sequelize({
        dialect: "sqlite",
        storage: TEST ? "database/test.sqlite3" : "database/local.sqlite3",
      });

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database has been connected successfully");
  } catch (error) {
    logger.error(`Error connecting to the database - ${error}`);
  }
};

export default sequelize;
