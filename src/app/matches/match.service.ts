import { CreateMatchDTO, GeralMatchDB, IMatch, MatchData } from './match.models';
import { database } from '@database';
import { betService } from '@app/bets/bet.service';
import * as _ from 'lodash';
import { BetResponse } from '@app/bets/bet.models';

export class MatchService {

    constructor() {
    }

    _findAllByCup = async (cupId: number): Promise<Array<IMatch>> => {
        return database.execute<Array<IMatch>>(`
            SELECT
                id,
                cup_id AS cupId,
                team_a_id AS teamIdA,
                team_b_id AS teamIdB,
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

    getConsolidatedMatches = async (userId: number, cupId: number): Promise<Array<GeralMatchDB>> => {
        return database.execute<Array<GeralMatchDB>>(`
            SELECT
                m.id AS match_id,
                m.cup_id AS match_cup_id,
                m.score_a AS match_score_a,
                m.score_b AS match_score_b,
                m.type AS match_type,
                m.match_date AS match_date,
                t.id AS team_a_id,
                t.name AS team_a_name,
                t.tag AS team_a_tag,
                t.avatar AS team_a_avatar,
                t2.id AS team_b_id,
                t2.name AS team_b_name,
                t2.tag AS team_b_tag,
                t2.avatar AS team_b_avatar,
                b.id AS bet_id,
                b.score_a AS bet_score_a,
                b.score_b AS bet_score_b,
                u.id AS user_id,
                u.google_user_id AS user_google_id,
                u.avatar AS user_avatar
            FROM
                \`match\` m
                INNER JOIN team t ON m.team_a_id = t.id
                INNER JOIN team t2 ON m.team_b_id = t2.id
                LEFT JOIN bet b ON m.id = b.match_id
                LEFT JOIN \`user\` u ON b.user_id = u.id
                AND u.id = ?
            WHERE
                cup_id = ?
        `, [userId, cupId]);
    };

    findOneById = async (id: number): Promise<IMatch> => {
        const [result] = await database.execute<Array<IMatch>>(`
            SELECT
                id,
                cup_id AS cupId,
                team_a_id AS teamIdA,
                team_b_id AS teamIdB,
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

    findAllByCup = async (userId: number): Promise<any> => {
        const data = await this.getConsolidatedMatches(userId, 1);

        const result = data.map(row => {
            const baseResult = {
                matchId: row.match_id,
                matchScoreA: row.match_score_a,
                matchScoreB: row.match_score_b,
                matchType: row.match_type,
                matchDate: row.match_date,
                teamIdA: row.team_a_id,
                teamNameA: row.team_a_name,
                teamTagA: row.team_a_tag,
                teamAvatarA: row.team_a_avatar,
                teamIdB: row.team_b_id,
                teamNameB: row.team_b_name,
                teamTagB: row.team_b_tag,
                teamAvatarB: row.team_b_avatar,
                betId: row.bet_id,
                betScoreA: row.bet_score_a,
                betScoreB: row.bet_score_b,
            };

            const bet: BetResponse = {
                id: row.bet_id,
                matchId: row.match_id,
                userId: row.user_id,
                scoreA: row.bet_score_a,
                scoreB: row.bet_score_b,
            }

            const match: MatchData = {
                id: row.match_id,
                cupId: row.match_cup_id,
                teamIdA: row.team_a_id,
                teamIdB: row.team_b_id,
                scoreA: row.match_score_a,
                scoreB: row.match_score_b,
                type: row.match_type,
                matchDate: row.match_date,
            }

            const betData = betService.getStatus(bet, match);

            return {...baseResult, ...betData};
        });

        return _.groupBy(result, "matchType");
    };

    create = async (match: CreateMatchDTO): Promise<void> => {
        const {cupId, teamIdA, teamIdB, scoreA, scoreB, type, matchDate} = match;

        const params = [cupId, teamIdA, teamIdB, scoreA, scoreB, type, matchDate];

        const sql = 'INSERT INTO match (cup_id, team_id_a, team_id_b, score_a, score_b, type, match_date) VALUES (?, ?, ?, ?, ?, ?, ?)';

        await database.execute(sql, params);
    };
}

export const matchService = new MatchService();
