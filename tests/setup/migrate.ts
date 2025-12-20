import { Umzug, SequelizeStorage } from "umzug";
import sequelize from "../../src/config/db.ts";
import type { QueryInterface } from "sequelize";

const migrate = new Umzug({
  migrations: {
    glob: "migrations/*.cjs",
    resolve: (params) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const migration = require(params.path as string);
      return {
        name: params.name,
        up: async () => {
          const queryInterface = sequelize.getQueryInterface();
          await migration.up(queryInterface, sequelize.constructor);
        },
        down: async () => {
          const queryInterface = sequelize.getQueryInterface();
          await migration.down(queryInterface, sequelize.constructor);
        },
      };
    },
  },
  context: sequelize.getQueryInterface() as QueryInterface,
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export default migrate;
