import path from 'path';
import fs from 'fs';
import appRoot from 'app-root-path';
import { logger } from '../../config/logger';

const dataRoot = path.join(appRoot.toString(), 'data');
if (!fs.existsSync(dataRoot)) {
  fs.mkdirSync(dataRoot);
}
const dbPath = path.join(dataRoot, 'mmw.db');

// eslint-disable-next-line no-unused-vars
const env = process.env.NODE_ENV || 'development';
export default {
  development: {
    username: null,
    password: null,
    storage: dbPath,
    database: 'mmw',
    dialect: 'sqlite',
    logging: logger.debug,
    operatorsAliases: false,
  },
  test: {
    username: null,
    password: null,
    database: 'mmw',
    storage: path.join(dataRoot, 'mmw-test.db'),
    dialect: 'sqlite',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
  },
};
