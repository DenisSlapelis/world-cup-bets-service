import { RankingDTO } from './ranking.models';
import { database } from '@database';
import dayjs = require('dayjs');
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

export class RankingService {
    constructor() {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.extend(isSameOrAfter);
    }

    getRanking = async (userId: number): Promise<Array<RankingDTO>> => {
         const sql = `
            SELECT
                u.id AS user_id,
                u.name AS user_name,
                SUM(b.total_points) as total
            FROM
                \`bet\` b
                INNER JOIN \`user\` u ON b.user_id = u.id
            WHERE
                b.total_points > 0
                AND u.is_test_user IS FALSE
            GROUP BY
                u.id
            ORDER BY
                total DESC
        `;

        const rows = await database.execute<Array<any>>(sql);

        return rows.map<RankingDTO>(row => {
            return {
                userId: row.user_id,
                userName: row.user_name,
                total: parseInt(row.total.toString()),
                isMine: userId == row.user_id,
            }
        });
    };
}

export const rankingService = new RankingService();
