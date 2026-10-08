const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const dbName = process.env.DB_NAME || 'aviar_db';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASSWORD || '';
const rawHost = process.env.DB_HOST || 'localhost';
const dbHost = rawHost.trim();
const dbPort = Number(process.env.DB_PORT) || 3306;

const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPass,
  {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 20000,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✓ MySQL Database Connected successfully to '${dbName}' on ${dbHost}:${dbPort}`);
  } catch (error) {
    console.error(`MySQL Connection Error (host: ${dbHost}, user: ${dbUser}, db: ${dbName}):`, error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
