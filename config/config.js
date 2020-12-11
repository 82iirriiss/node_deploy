require('dotenv').config();

module.exports = {
    development: {
        username: "root",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "nodebird",
        host: "127.0.0.1",
        dialect: "mysql"
      },
      test: {
          username : "root",
          password: process.env.SEQUELIZE_PASSWORD,
        database: "nodebird_test",
        host: "127.0.0.1",
        dialect: "mysql"
      },
      production: {
        username: "dbmasteruser",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "Database-1",
        host: "ls-bbd465fa70ae045a4409a62376b7e880fcd5bb40.cq9jykrqsudh.ap-northeast-2.rds.amazonaws.com",
        dialect: "mysql",
        logging: false
      }
}
