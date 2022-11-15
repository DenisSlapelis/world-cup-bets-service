import * as mysql from 'mysql2/promise';
import { mySqlConfig } from './config';

export class Database {
    constructor() {}

    async execute(sql: string, params: Array<any> = []) {
        const connection = await mysql.createConnection(mySqlConfig);

        const [result] = await connection.execute(sql, params);

        await connection.end();

        return result;
    }
}

export const database = new Database();
