import { environment as env } from '@env';

export const mySqlConfig = {
    host: env.databaseHost,
    user: env.databaseUsername,
    password: env.databasePassword,
    database: env.databaseName,
};
