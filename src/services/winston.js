import winston from 'winston';

import { rootPath } from '../utils/rootPath.js';

const logger = new winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: `${rootPath}/logs/errors.log`,
      format: winston.format.json(),
      maxsize: 5 * 1024 * 1000, // 5MB
      maxFiles: 5,
      handleExceptions: true,
      handleRejections: true,
    }),
    new winston.transports.File({
      level: 'info',
      filename: `${rootPath}/logs/infos.log`,
      format: winston.format.json(),
      maxsize: 5 * 1024 * 1000, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      level: 'warn',
      filename: `${rootPath}/logs/warnings.log`,
      format: winston.format.json(),
      maxsize: 5 * 1024 * 1000, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.Console({
      level: 'error',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => {
          console.log(info.level, info.message);
          console.log(info.trace);
        })
        // winston.format.prettyPrint()
      ),
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: function (message) {
    logger.info(message);
  },
};

export default logger;
