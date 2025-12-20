require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
  staging: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
  local: {
    dialect: "sqlite",
    storage: "database/local.sqlite3",
  },
  test: {
    dialect: "sqlite",
    storage: "database/test.sqlite3",
  },
};
