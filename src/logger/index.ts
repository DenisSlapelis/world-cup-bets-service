import * as expressWinston from 'express-winston';
import { options as defaultOptions } from './default-options';
import { options as errorOptions } from './error-options';

const logger = expressWinston.logger(defaultOptions);
const errorLogger = expressWinston.errorLogger(errorOptions);

export { logger, errorLogger };
