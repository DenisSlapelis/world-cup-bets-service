import * as mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';
import { mySqlConfig } from './config';

export class Database {
    constructor() {}

    async execute<T>(sql: string, params: Array<any> = []): Promise<T> {
        const connection = await mysql.createConnection(mySqlConfig);

        const [result] = await connection.execute<RowDataPacket[]>(sql, params);

        await connection.end();

        return result as T;
    }
}

export const database = new Database();
