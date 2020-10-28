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

async function createConnection(dbConfigObj: MongoConfig, options: ConnectionOptions): Promise<Connection> {
  const { host, port, database, username, password } = dbConfigObj;
  let url = 'mongodb://' + username + ':' + password + '@' + host + ':' + port + '/' + database;

  let connection: Connection;
  try {
    await mongoose.connect(url, options);
    connection = mongoose.connection;
    return connection;
  } catch (e) {
    logger.info('[vendor-registration] db connection error: ' + e.message);
    throw e;
  }
}

function closeConnection(connection: Connection) {
  connection
    .close()
    .then(() => {})
    .catch(() => {});
}

export { createConnection, closeConnection };
