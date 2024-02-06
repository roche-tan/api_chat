import { Sequelize } from 'sequelize';
import config from '../../config';

export const sequelize = new Sequelize(
  config.sqlDatabase,
  config.sqlUser,
  config.sqlPassword,
  {
    host: config.sqlHost,
    dialect: 'mysql',
    port: config.sqlPort
  }
);

export const connectDbMysql = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');
    return sequelize;
  } catch (error) {
    console.log('Unable to connect to the database: ', error);
    throw error;
  }
};
