import { ConsolidatedMatchDTO, CreateMatchDTO, GeralMatchDB, IMatch, MatchData, MatchTypeENUM, MatchTypeTitlesENUM, UpdateMatchDTO } from './match.models';
import { database } from '@database';
import { betService } from '@app/bets/bet.service';
import * as _ from 'lodash';
import { ResultSetHeader } from 'mysql2';
import { wolrdCupAPIService } from '@app/integrations/world-cup.service';
import dayjs from 'dayjs';

export class MatchService {

    constructor() {
    }

    _findAllByCup = async (cupId: number, filter?: Record<string, any>): Promise<Array<IMatch>> => {
        const params = [cupId];

        const result = await database.execute<Array<IMatch>>(`
            SELECT
                m.id,
                m.cup_id AS cupId,
                m.team_a_id AS teamIdA,
                m.team_b_id AS teamIdB,
                m.score_a AS scoreA,
                m.score_b AS scoreB,
                m.type,
                m.match_date AS matchDate,
                t.tag AS team_a_tag,
                t2.tag AS team_b_tag
            FROM
                \`match\` m
                INNER JOIN team t ON m.team_a_id = t.id
                INNER JOIN team t2 ON m.team_b_id = t2.id
            WHERE
                cup_id = ?
                ${filter?.todayMatches ? 'AND DAY(match_date) = DAY(NOW())' : ''}
                ${filter?.scheduledMatches ? 'AND (score_a IS NULL OR score_b IS NULL)' : ''}
        `, params);

        return result;
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

        const { teamId, teamName, teamTag, status } = filters;

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
                ${teamId ? `AND (t.id = ${teamId} OR t2.id = ${teamId})` : ''}
                ${teamTag ? `AND (UPPER(t.tag) LIKE '%${teamTag.toUpperCase()}%' OR UPPER(t2.tag) LIKE '%${teamTag.toUpperCase()}%')` : ''}
                ${teamName ? `AND (UPPER(t.name) LIKE '%${teamName.toUpperCase()}%' OR UPPER(t2.name) LIKE '%${teamName.toUpperCase()}%')` : ''}
                ${status ? 'AND DATE(m.match_date) >= DATE(DATE_SUB(NOW(), INTERVAL 3 HOUR))': ''}
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

    formatConsolidateObject = (data: Array<GeralMatchDB>, reqUserId: number, userId: number) => {
        return data.map(row => {
            const matchDate = row.match_date;
            const matchScoreA = row.match_score_a;
            const matchScoreB = row.match_score_b;

            return {
                matchId: row.match_id,
                matchScoreA,
                matchScoreB,
                matchType: row.match_type,
                matchDate,
                formattedMatchDate: dayjs(matchDate).format('YYYY-MM-DD'),
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
                canShow: betService.getCanShow(matchDate, reqUserId, userId),
            };
        });
    }

    parseResultGroupByType = (data: Array<ConsolidatedMatchDTO>) => {
        const result =_.groupBy(data, "matchType");

        for (const matchType in result) {
            const matches = result[matchType];

            result[matchType] = _.orderBy(matches, "matchDate", "asc");
        }

        return result;
    }

    formatNameByType = (type: MatchTypeENUM, date: string) => {
        const titles = {...MatchTypeTitlesENUM};

        return `${titles[type]} - ${dayjs(date).format('DD/MM/YYYY')}`;
    }

    parseResultGroupByRemainingDates = (data: Array<ConsolidatedMatchDTO>) => {
        const result = [];
        const groupByDateMatches = _.groupBy(data, "formattedMatchDate");

        for (const matchDate in groupByDateMatches) {
            const matches = _.orderBy(groupByDateMatches[matchDate], "matchDate", "asc");
            const date =  dayjs(matchDate).format('YYYY-MM-DD');
            const type = _.first(matches)?.matchType;

            const formattedResult = {
                name: this.formatNameByType(type as MatchTypeENUM, date),
                date,
                matches,
            }

            result.push(formattedResult);
        }

        return _.orderBy(result, "date", "asc");
    }

    findAllByCup = async (reqUserId: number, filters: Record<string, any>): Promise<any> => {
        const { userId, status } = filters;
        const data = await this.getConsolidatedMatches(userId || reqUserId, filters, 1);

        const formattedData: Array<ConsolidatedMatchDTO> = this.formatConsolidateObject(data, reqUserId, userId);

        const resultStatus = status || 'types';

        const resultFormat: Record<any, any> = {
            'remaining': this.parseResultGroupByRemainingDates(formattedData),
            'types': this.parseResultGroupByType(formattedData),
        }

        return resultFormat[resultStatus];
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

    syncMatchResults = async () => {
        const [completedMatches, todayMatches] = await Promise.all([
            wolrdCupAPIService.matchesToday({completed: true}),
            this._findAllByCup(1, {todayMatches: true, scheduledMatches: true}),
        ]);

        for (const apiMatch of completedMatches) {
            const {country: teamTagA, goals: scoreA} = apiMatch?.homeTeam;
            const {country: teamTagB, goals: scoreB} = apiMatch?.awayTeam;

            const convertedTagA = wolrdCupAPIService.teamTagsDict[teamTagA];
            const convertedTagB = wolrdCupAPIService.teamTagsDict[teamTagB];

            const matchId = todayMatches.find(match => (match.team_a_tag === convertedTagA) && (match.team_b_tag === convertedTagB))?.id;

            if (matchId){
                await this.update(matchId, {scoreA, scoreB});
            } else {
                const inverseMatchId = todayMatches.find(match => (match.team_a_tag === convertedTagB) && (match.team_b_tag === convertedTagA))?.id;

                if (inverseMatchId) {
                    await this.update(inverseMatchId, {scoreA: scoreB, scoreB: scoreA });
                }
            }
        }
    }
}

export const matchService = new MatchService();
