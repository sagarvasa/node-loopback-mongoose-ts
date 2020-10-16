import mongoose, { Connection, ConnectionOptions } from 'mongoose';
import logger from '../utilities/winston';

interface MongoConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  poolSize?: number;
}

const createConnection = function (dbConfigObj: MongoConfig, options: ConnectionOptions): Promise<Connection> {
  return new Promise(async (resolve, reject) => {
    const { host, port, database, username, password } = dbConfigObj;
    let url = 'mongodb://' + username + ':' + password + '@' + host + ':' + port + '/' + database;
    let connection: Connection;
    try {
      await mongoose.connect(url, options);
      connection = mongoose.connection;

      resolve(connection);
    } catch (e) {
      logger.info('[vendor-registration] db connection error: ' + e.message);
      reject(e);
    }
  });
};

export { createConnection };
