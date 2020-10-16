import { Connection } from 'mongoose';
import logger from '../utilities/winston';
import { createConnection } from '../datasources';

const configurations = global.centralConfig;

let mongodbConfig = {
  host: configurations.host,
  port: configurations.port,
  database: configurations.database,
  username: configurations.username,
  password: configurations.password,
  poolSize: configurations.poolSize,
};

export class MongoConnectionHelper {
  private connectionObj: Connection;

  public establishConnection(): Promise<Connection | object> {
    return new Promise(async (resolve, reject) => {
      try {
        const { host, port, database, username, password, poolSize } = mongodbConfig;
        let options = {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          poolSize: poolSize,
          useFindAndModify: false,
        };
        this.connectionObj = await createConnection({ host, port, database, username, password }, options);
        resolve(this.connectionObj);
      } catch (error) {
        logger.info('[vendor-registration] Establish connection error: ' + error.message);
        reject(error);
      }
    });
  }

  public getConnection(): Promise<object> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.connectionObj) {
          return reject({ message: 'Please establish connection first' });
        }
        let db = this.connectionObj.db;
        return resolve({ client: this.connectionObj, db });
      } catch (err) {
        logger.info('[vendor-registration] Get connection error: ' + err.message);
        reject(err);
      }
    });
  }

  public closeConnection(connectionObj?: Connection): boolean {
    try {
      connectionObj?.close();
    } catch (err) {
      logger.info('[vendor-registration] Close connection error: ' + err.message);
    } finally {
      return true;
    }
  }
}
