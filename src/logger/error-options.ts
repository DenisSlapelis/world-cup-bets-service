import * as winston from 'winston';

const options = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
};

export { options };
