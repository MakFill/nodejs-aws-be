import * as pg from 'pg';
import { Sequelize } from 'sequelize';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export const sequelize = new Sequelize({
  database: PG_DATABASE,
  username: PG_USERNAME,
  password: PG_PASSWORD,
  host: PG_HOST,
  port: +PG_PORT,
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
