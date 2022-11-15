import * as winston from 'winston';
const {
    format: { combine, colorize },
    addColors,
} = winston;
const colorizer = colorize();

const options = {
    transports: [new winston.transports.Console()],
    format: combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:MM:SS',
        }),
        winston.format.label({
            label: '[LOGGER]',
        }),
        winston.format.simple(),
        winston.format.printf((msg) =>
            colorizer.colorize(msg.level, `[${msg.timestamp}] - [${msg.level.toLocaleUpperCase()}]: ${msg.message}`)
        )
    ),
    ignoreRoute: function (req: any, res: any) {
        return false;
    }, // optional: allows to skip some log messages based on request and/or response
};

addColors({
    info: 'yellow',
    warn: 'italic orange', // fontStyle color
    error: 'bold red',
    debug: 'green',
});

export { options };
