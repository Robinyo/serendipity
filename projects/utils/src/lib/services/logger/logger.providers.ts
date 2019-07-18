import { LoggerService } from './logger.service';
import { ConsoleLoggerService } from './console-logger.service';

export const loggerProviders = [
  { provide: LoggerService, useClass: ConsoleLoggerService }
];
