import winston from 'winston';
import appRoot from 'app-root-path';
import split from 'split';
import path from 'path';
import fs from 'fs';

export const ACCESS_FORMAT = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length]';

const logRoot = path.join(appRoot.toString(), 'logs');
if (!fs.existsSync(logRoot)) {
  fs.mkdirSync(logRoot);
}

// define the custom settings for each transport (file, console)
const myFormat = winston.format.printf(
  info => `${info.timestamp} [${info.level}]: ${info.message}`,
);
const accessLogFormat = winston.format.printf(info => `${info.timestamp} - ${info.message}`);

const options = {
  file: {
    level: 'info',
    filename: `${logRoot}/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: winston.format.json(),
  },
  accessLog: {
    level: 'info',
    filename: `${appRoot}/logs/access.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: winston.format.combine(winston.format.timestamp(), accessLogFormat),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize(),
      winston.format.timestamp(),
      myFormat,
    ),
  },
};

// instantiate a new Winston Logger with the settings defined above
export const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

export const accessLogger = winston.createLogger({
  transports: [new winston.transports.File(options.accessLog)],
  exitOnError: false, // do not exit on handled exceptions
});
accessLogger.info('starting..');
// create a stream object with a 'write' function that will be used by `morgan`
accessLogger.stream = split().on('data', line => accessLogger.info(line));
