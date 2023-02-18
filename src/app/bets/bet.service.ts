import { BetCreateDTO, IBet, BetUpdateDTO, BetResponse, BetScoreValuesENUM } from './bet.models';
import { database } from '@database';
import { matchService } from '@app/matches/match.service';
import dayjs = require('dayjs');
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { MatchData, MatchTypeENUM, MatchTypeWeightsENUM } from '@app/matches/match.models';
import { teamService } from '@app/teams/teams.service';
import { excelData } from './import-data';
import { floor, isNaN, isNull } from 'lodash';
import _ = require('lodash');
import { ResultSetHeader } from 'mysql2';
import { environment as env } from '@env';

export class BetService {
    constructor() {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.extend(isSameOrAfter);
    }

    findAllByUser = async (userId: number, matchId?: number): Promise<Array<IBet>> => {
        const params = [userId];

        if(matchId) params.push(matchId);

        return database.execute<IBet[]>(`
            SELECT
                id,
                user_id AS userId,
                match_id AS matchId,
                score_a AS scoreA,
                score_b AS scoreB
            FROM
                bet
            WHERE
                user_id = ?
                ${matchId ? 'AND match_id = ?' : ''}
        `, params);
    };

    findAllByMatch = async (matchId: number): Promise<Array<IBet>> => {
        const params = [matchId];

        return database.execute<IBet[]>(`
            SELECT
                id,
                user_id AS userId,
                match_id AS matchId,
                score_a AS scoreA,
                score_b AS scoreB
            FROM
                bet
            WHERE
                match_id = ?
        `, params);
    };

    findOneById = async (id: number): Promise<IBet> => {
        const [result] = await database.execute<IBet[]>(`
            SELECT
                id,
                user_id AS userId,
                match_id AS matchId,
                score_a AS scoreA,
                score_b AS scoreB
            FROM
                bet
            WHERE
                id = ?
        `, [id]);

        return result;
    };

    create = async (bets: Array<BetCreateDTO>, userId: number): Promise<Array<BetResponse>> => {
        const perChunk = env.betChunkValue ?? 3;

        const allBets = _.chunk(bets, parseInt(perChunk.toString()));

        const result:Array<BetResponse> = [];

        for (const betArr of allBets) {
            const promises = betArr.map(async (bet) => {
                await this.checkCreateValidations(bet, userId);

                const { matchId, scoreA, scoreB } = bet;

                const params = [userId, matchId, scoreA, scoreB];

                const sql = 'INSERT INTO bet (user_id, match_id, score_a, score_b) VALUES (?, ?, ?, ?)';

                const { insertId } = await database.execute<ResultSetHeader>(sql, params);

                result.push({
                    id: insertId,
                    userId,
                    ...bet,
                });
            });

            await Promise.all(promises);
        }

        return result;
    };

    checkCreateValidations = async (bet: BetCreateDTO, userId: number) => {
        const [match, existingBet] = await Promise.all([
            matchService.findOneById(bet.matchId),
            this.findAllByUser(userId, bet.matchId),
        ]);

        if (existingBet.length){
            throw new Error('Você já criou uma aposta para essa partida');
        }

        if (dayjs().isSameOrAfter(match.matchDate)){
            throw new Error('Você não pode apostar em uma partida que já iniciou.');
        }
    }

    update = async (bets: Array<BetUpdateDTO>, userId: number): Promise<void> => {
        const perChunk = env.betChunkValue ?? 3;

        const allBets = _.chunk(bets, parseInt(perChunk.toString()));

        for (const betArr of allBets) {
            const promises = betArr.map(async bet => {
                await this.checkUpdateValidations(bet, userId);

                const sql = 'UPDATE bet SET score_a = ?, score_b = ? WHERE id = ?';

                const { id, scoreA, scoreB } = bet;

                const params = [scoreA, scoreB, id];

                await database.execute(sql, params);
            });

            await Promise.all(promises);
        }
    };

    checkUpdateValidations = async (bet: BetUpdateDTO, userId: number) => {
        const [match, existingBet] = await Promise.all([
            matchService.findOneById(bet.matchId),
            this.findOneById(bet.id),
        ]);

        if (userId != existingBet.userId){
            throw new Error('Você não pode alterar a aposta de outro usuário, seu sujo.');
        }

        if (dayjs().isSameOrAfter(match.matchDate)){
            throw new Error('Você não pode alterar a aposta de uma partida que já iniciou.');
        }

        if(!bet.id || isNaN(bet.scoreA) || isNaN(bet.scoreB)) {
            throw new Error('Parâmetros inválidos');
        }
    }

    calculateWinner = (data: Partial<BetResponse>) => {
        const winnerA = data.scoreA! > data.scoreB!;
        const winnerB = data.scoreB! > data.scoreA!;

        if(winnerA) return 'WINNER_A';
        if(winnerB) return 'WINNER_B';

        return 'DRAW';
    }

    correctResult = (bet: BetResponse, match: MatchData) => {
        if(isNull(match.scoreA) || isNull(match.scoreB)){
            return false;
        }

        const betWinner = this.calculateWinner(bet);
        const matchWinner = this.calculateWinner(match);

        return betWinner === matchWinner;
    }

    correctOneTeamScore = (bet: BetResponse, match: MatchData) => {
        const correctScoreA = bet.scoreA === match.scoreA;
        const correctScoreB = bet.scoreB === match.scoreB;

        return (correctScoreA && !correctScoreB) || (!correctScoreA && correctScoreB);
    }

    correctBothScore = (bet: BetResponse, match: MatchData) => {
        const correctScoreA = bet.scoreA === match.scoreA;
        const correctScoreB = bet.scoreB === match.scoreB;

        return correctScoreA && correctScoreB;
    }

    applyWeightByRound = (basePoints: number, matchType: MatchTypeENUM) => {
        const weights = {...MatchTypeWeightsENUM};

        return floor(basePoints * weights[matchType]);
    }

    calculatePoints = (bet: BetResponse, match: MatchData) => {
        const points = [];

       if (this.correctOneTeamScore(bet, match)){
            points.push(BetScoreValuesENUM.ONE_TEAM_SCORE);
        }

       if (this.correctResult(bet, match)) {
            points.push(BetScoreValuesENUM.WINNER_OR_DRAW);
       }

       if (this.correctBothScore(bet, match)) {
            points.push(BetScoreValuesENUM.EXACT_SCORE);
       }

        return points.reduce((prev: number, current: number) => prev + this.applyWeightByRound(current, match.type), 0);
    }

    getCanEdit = (matchDate: Date, matchScoreA: number, matchScoreB: number, reqUserId: number, userId: number | undefined) => {
        const sameUser = !userId || reqUserId == userId;
        const todayIsBeforeMatch = dayjs().isBefore(matchDate);
        const scoreAIsNull = isNull(matchScoreA);
        const scoreBIsNull = isNull(matchScoreB);

        return !sameUser ? false : todayIsBeforeMatch && scoreAIsNull && scoreBIsNull;
    }

    getCanShow = (matchDate: Date, reqUserId: number, userId: number | undefined) => {
        const sameUser = !userId || reqUserId == userId;
        const todayIsAfterMatch = dayjs().isAfter(matchDate);

        return sameUser ? true : todayIsAfterMatch;
    }

    import = async (userId: number) => {
        const [matchData, teamData] = await Promise.all([
            matchService._findAllByCup(1),
            teamService.findAll(),
        ]);

        const matches: any = {};
        const teams: any = {};
        const bets: Array<BetCreateDTO> = [];

        teamData.forEach(team => {
            teams[team.name] = team.id;
        });

        matchData.forEach(match => {
            matches[`${match.teamIdA}_${match.teamIdB}`] = match.id;
        })

        excelData.forEach((row: any, idx: number) => {
            const [teamNameA, scoreA, scoreB, teamNameB] = row;

            const teamIdA = teams[teamNameA.toString().replaceAll('_', ' ')];
            const teamIdB = teams[teamNameB.toString().replaceAll('_', ' ')];
            const matchId = matches[`${teamIdA}_${teamIdB}`];

            if (!matchId) throw new Error(`Partida não encontrada [${idx}] - ${teamNameA}, ${scoreA}, ${scoreB}, ${teamNameB}`);

            bets.push({
                matchId,
                scoreA: parseInt(scoreA.toString()),
                scoreB: parseInt(scoreB.toString()),
            });
        });

        await this.create(bets, userId);
    }

    updateBetPointsByMatch = async (match: MatchData) => {
        const bets = await this.findAllByMatch(match.id);

        const perChunk = env.betChunkValue ?? 3;

        const allBets = _.chunk(bets, parseInt(perChunk.toString()));

        for (const betArr of allBets) {
            const promises = betArr.map(async bet => {
                const totalPoints = this.calculatePoints(bet, match);

                const sql = `UPDATE bet SET total_points = ? WHERE id = ?`;

                const params = [totalPoints, bet.id];

                return database.execute(sql, params);
            });

            await Promise.all(promises);
        }
    }

    recalcAllTotalPoints = async () => {
        const matches = await matchService.findAllFinishedMatches(1);

        for (const match of matches) {
            console.log('== match id: ', match.id);

            await this.updateBetPointsByMatch(match);
        }

        console.log('== FINISH REACALCULATE POINTS');
    }
}

export const betService = new BetService();
