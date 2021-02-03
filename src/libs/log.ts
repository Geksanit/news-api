import winston from 'winston';

const log = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  // defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  log.add(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple(),
      ),
      handleExceptions: true,
    }),
  );
}
export { log };
