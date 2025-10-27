const winston = require('winston');
const expressWinston = require('express-winston');

export const requestLogger = expressWinston.logger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'logs/request.log' }),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  level: 'error',
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
  ],
  format: winston.format.json(),
});

export const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});
