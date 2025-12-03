const { Sequelize } = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {
  Sequelize,
  sequelize,
  User: require('./user')(sequelize, Sequelize),
  Tournament: require('./tournament')(sequelize, Sequelize),
  Team: require('./team')(sequelize, Sequelize),
  Match: require('./match')(sequelize, Sequelize),
  Message: require('./Message')(sequelize, Sequelize),
  Registration: require('./Registration')(sequelize, Sequelize)
};

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;