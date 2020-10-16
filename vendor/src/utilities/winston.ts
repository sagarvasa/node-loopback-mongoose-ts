import { Response } from 'express';
import winston, { transports } from 'winston';
import util from 'util';

import { Constants } from './constants';
const env = process.env.NODE_ENV ?? 'local';

let winstonTransport = new transports.Console();

const winstonLogger = new winston.Logger({
  transports: [winstonTransport],
});

class Logger {
  private env: string;
  private logger;

  constructor() {
    this.env = env;
    this.logger = winstonLogger;
    this.info = this.info.bind(this);
    this.put = this.put.bind(this);
  }

  public info(message: string, res?: Response) {
    if (res?.get(Constants.CORR_ID)) {
      message = util.format('[Request : %s][%s]%s', res.get(Constants.CORR_ID), this.env, message);
    }
    this.logger.info(message);
  }

  public put(msg: string, res?: Response, error?: Error) {
    msg = util.format('[Worker : %s][%s] %s', process.pid, this.env, msg);

    if (res?.get(Constants.CORR_ID)) {
      msg = util.format('[Request : %s][%s]%s', res.get(Constants.CORR_ID), this.env, msg);
    }

    this.logger.info(msg);

    if (error) {
      let errorMsg = util.format('[Worker : %s][%s]', process.pid, this.env);

      if (res?.get(Constants.CORR_ID)) {
        msg = util.format('[Request : %s][%s]%s %s', res.get(Constants.CORR_ID), this.env, errorMsg, error.message);
      }

      errorMsg = util.format('%s [....Stack....] : %s', errorMsg, error.stack);

      this.logger.info(errorMsg);
    }
  }
}

export default new Logger();
