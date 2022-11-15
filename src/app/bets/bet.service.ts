import { BetResponse } from './bet.models';
import { database } from '@database';
import { toCamelCase } from '@helpers';

export class BetService {
    constructor() {}

    getBetsByUser = async (): Promise<Array<BetResponse>> => {
        const data = await database.execute('SELECT * FROM bet WHERE user_id = 1');

        const result: Array<BetResponse> = data.map((row) => toCamelCase(row));

        return result;
    };

    create = async (): Promise<BetResponse> => {
        const sql = 'INSERT INTO bet (user_id, match_id, score_a, score_b) VALUES (?, ?, ?, ?)';
        const data = await database.execute(sql, [1, 1, 1, 2]);

        const result: Array<BetResponse> = data.map((row) => toCamelCase(row));

        return result[0];
    };
}

export const betService = new BetService();
