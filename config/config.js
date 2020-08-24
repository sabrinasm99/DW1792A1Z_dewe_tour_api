module.exports = {
  development: {
    username: "root",
    password: process.env.DB_PASS,
    database: "dewetour",
    host: "188.166.217.100",
    port: 8000,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.DB_PASS,
    database: "dewetour",
    host: "188.166.217.100",
    port: 8000,
    dialect: "mysql",
    dialectOption: {
      ssl: "true",
    },
  },
};
