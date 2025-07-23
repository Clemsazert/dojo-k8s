import { transports, createLogger, format } from 'winston';

export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.errors({ stack: true }), // Ref.: https://stackoverflow.com/a/58475687
  ),
  defaultMeta: { service: 'api' },
  transports: [new transports.Console({ level: 'info' })],
});
