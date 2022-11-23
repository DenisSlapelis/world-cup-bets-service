import { CreateMatchDTO, GeralMatchDB, IMatch, MatchData, UpdateMatchDTO } from './match.models';
import { database } from '@database';
import { betService } from '@app/bets/bet.service';
import * as _ from 'lodash';
import { ResultSetHeader } from 'mysql2';

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

    findAllFinishedMatches = async (cupId: number): Promise<Array<IMatch>> => {
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
                AND score_a IS NOT NULL
                AND score_b IS NOT NULL
        `, [cupId]);
    };

    getConsolidatedMatches = async (userId: number, filters: Record<string, any>, cupId: number): Promise<Array<GeralMatchDB>> => {
        const params = [userId, cupId];

        const { team } = filters;

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
                COALESCE(b.total_points, 0) AS bet_total_points,
                u.id AS user_id,
                u.google_user_id AS user_google_id,
                u.avatar AS user_avatar
            FROM
                \`match\` m
                INNER JOIN team t ON m.team_a_id = t.id
                INNER JOIN team t2 ON m.team_b_id = t2.id
                LEFT JOIN bet b ON m.id = b.match_id
                AND b.user_id = ?
                LEFT JOIN \`user\` u ON b.user_id = u.id
            WHERE
                cup_id = ?
                ${team ? `AND (UPPER(t.name) LIKE '%${team.toUpperCase()}%' OR UPPER(t2.name) LIKE '%${team.toUpperCase()}%')` : ''}
        `, params);
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

    findAllByCup = async (reqUserId: number, filters: Record<string, any>): Promise<any> => {
        const { userId } = filters;
        const data = await this.getConsolidatedMatches(userId || reqUserId, filters, 1);

        const formattedData = data.map(row => {
            const matchDate = row.match_date;
            const matchScoreA = row.match_score_a;
            const matchScoreB = row.match_score_b;

            return {
                matchId: row.match_id,
                matchScoreA,
                matchScoreB,
                matchType: row.match_type,
                matchDate,
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
                totalPoints: row.bet_total_points,
                canEdit: betService.getCanEdit(matchDate, matchScoreA, matchScoreB, reqUserId, userId),
            };
        });

        const result =_.groupBy(formattedData, "matchType");

        for (const matchType in result) {
            const matches = result[matchType];

            result[matchType] = _.orderBy(matches, "matchDate", "asc");
        }

        return result;
    };

    create = async (match: CreateMatchDTO): Promise<MatchData> => {
        const {cupId, teamIdA, teamIdB, scoreA, scoreB, type, matchDate} = match;

        const params = [cupId, teamIdA, teamIdB, scoreA, scoreB, type, matchDate];

        const sql = 'INSERT INTO match (cup_id, team_id_a, team_id_b, score_a, score_b, type, match_date) VALUES (?, ?, ?, ?, ?, ?, ?)';

        const { insertId } = await database.execute<ResultSetHeader>(sql, params);

        return {...match, id:insertId }
    };

    update = async (id: number, match: UpdateMatchDTO): Promise<Record<string, number | undefined>> => {
        const { scoreA, scoreB, matchDate } = match;

        const params: Array<any> = [scoreA, scoreB, id];

        if(matchDate) params.splice(2, 0, matchDate);

        const sql = `UPDATE \`match\` SET score_a = ?, score_b = ? ${matchDate ? ', match_date = ?' : ''} WHERE id = ?`;

        const { changedRows } = await database.execute<ResultSetHeader>(sql, params);

        if(!changedRows)
            return {};

        const updatedMatch = await this.findOneById(id);

        await betService.updateBetPointsByMatch(updatedMatch);

        return updatedMatch;
    };

}

export const matchService = new MatchService();
