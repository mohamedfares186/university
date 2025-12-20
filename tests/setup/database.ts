import sequelize from "../../src/config/db.ts";
import migrate from "./migrate.ts";

export const connectTestDb = async () => {
  await sequelize.authenticate();
  await migrate.up();
};

export const disconnectTestDb = async () => {
  await migrate.down({ to: 0 });
  await sequelize.close();
};
