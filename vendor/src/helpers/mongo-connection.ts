import { Connection } from 'mongoose';
import logger from '../utilities/winston';
import { createConnection, closeConnection as closeMongoConnection } from '../datasources';

const configurations = global.centralConfig;

const mongodbConfig = {
  host: configurations.host,
  port: configurations.port,
  database: configurations.database,
  username: configurations.username,
  password: configurations.password,
  poolSize: configurations.poolSize,
};

class MongoConnectionHelper {
  private connectionObj: Connection;

  public async establishConnection(): Promise<Connection | object> {
    try {
      const { host, port, database, username, password, poolSize } = mongodbConfig;
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: poolSize,
        useFindAndModify: false,
      };
      this.connectionObj = await createConnection({ host, port, database, username, password }, options);
      return this.connectionObj;
    } catch (error) {
      logger.info('[vendor-registration] Establish connection error: ' + error.message);
      throw error;
    }
  }

  public async getConnection(): Promise<object> {
    try {
      if (!this.connectionObj) {
        throw new Error('Please establish connection first');
      }
      const db = this.connectionObj.db;
      return { client: this.connectionObj, db };
    } catch (err) {
      logger.put('[seller-registration] Get connection error: ' + err.message);
      throw err;
    }
  }

  public closeConnection(connectionObj?: Connection): void {
    try {
      if (connectionObj) {
        closeMongoConnection(connectionObj);
      }
    } catch (err) {
      logger.info('[vendor-registration] Close connection error: ' + err.message);
    }
  }
}

export = new MongoConnectionHelper();
