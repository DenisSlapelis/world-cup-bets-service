import { MatchResponse, MatchResponseWithBets } from './match.models';
import { database } from '@database';
import { betService } from '@app/bets/bet.service';

export class MatchService {

    constructor() {
    }

    _findAllByCup = async (cupId: number): Promise<Array<MatchResponse>> => {
        return database.execute<Array<MatchResponse>>(`
            SELECT
                id,
                cup_id AS cupId,
                team_a_id AS teamAId,
                team_b_id AS teamBId,
                score_a AS scoreA,
                score_b AS scoreB,
                type,
                match_date AS matchDate
            FROM
                \`match\`
            WHERE
                cup_id = ?
        `, [cupId]);
    };

    findOneById = async (id: number): Promise<MatchResponse> => {
        const [result] = await database.execute<Array<MatchResponse>>(`
            SELECT
                id,
                cup_id AS cupId,
                team_a_id AS teamAId,
                team_b_id AS teamBId,
                score_a AS scoreA,
                score_b AS scoreB,
                type,
                match_date AS matchDate
            FROM
                \`match\`
            WHERE
                id = ?
        `, [id]);

        return result;
    };

    findAllByCup = async (userId: number, includeBets: boolean): Promise<Array<MatchResponseWithBets | MatchResponse>> => {
        const matches = await this._findAllByCup(1);

        if (!includeBets) {
            return matches;
        }

        const betsData = await betService.findAllByUser(userId);

        return matches.map((match: MatchResponse) => {
            const bet = betsData.find(bet => bet.matchId === match.id);

            const betStatus = bet ? betService.getStatus(bet, match) : {};

            return {...match, bet: {...bet, ...betStatus } };
        });
    };

    create = async (): Promise<void> => {
        const sql = 'INSERT INTO match (user_id, match_id, score_a, score_b) VALUES (?, ?, ?, ?)';

        await database.execute(sql, [1, 1, 1, 2]);
    };
}

export const matchService = new MatchService();
