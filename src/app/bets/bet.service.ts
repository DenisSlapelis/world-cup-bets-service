import { BetCreateDTO, IBet, BetUpdateDTO, BetResponse } from './bet.models';
import { database } from '@database';
import { matchService } from '@app/matches/match.service';
import dayjs = require('dayjs');
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { MatchData, MatchTypeENUM, MatchTypeWeightsENUM } from '@app/matches/match.models';

export class BetService {
    constructor() {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.extend(isSameOrAfter);
    }

    findAllByUser = async (userId: number, matchId?: number): Promise<Array<IBet>> => {
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
        `, [userId, matchId]);
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

    create = async (bets: Array<BetCreateDTO>, userId: number): Promise<void> => {
        const promises = bets.map(async (bet) => {
            await this.checkCreateValidations(bet, userId);

            const { matchId, scoreA, scoreB } = bet;

            const params = [userId, matchId, scoreA, scoreB];

            const sql = 'INSERT INTO bet (user_id, match_id, score_a, score_b) VALUES (?, ?, ?, ?)';

            await database.execute(sql, params);
        });

        await Promise.all(promises);
    };

    checkCreateValidations = async (bet: BetCreateDTO, userId: number) => {
         const [match, existingBet] = await Promise.all([
            matchService.findOneById(bet.matchId),
            this.findAllByUser(bet.userId, bet.matchId),
         ]);

         if (existingBet){
            throw new Error('Você já criou uma aposta para essa partida');
         }

        if (bet.userId !== userId) {
            throw new Error('Você não pode criar uma aposta para um outro usuário, seu pimlantra.');
        }

        if (dayjs().isSameOrAfter(match.matchDate)){
            throw new Error('Você não pode apostar em uma partida que já iniciou.');
        }
    }

    update = async (bets: Array<BetUpdateDTO>, userId: number): Promise<void> => {
        const promises = bets.map(async bet => {
            bet.userId = userId;
            await this.checkUpdateValidations(bet);

            const sql = 'UPDATE bet SET score_a = ?, score_b = ? WHERE id = ?';

            const { id, scoreA, scoreB } = bet;

            const params = [id, scoreA, scoreB];

            await database.execute(sql, params);
        });

        await Promise.all(promises);
    };

    checkUpdateValidations = async (bet: BetUpdateDTO) => {
        const [match, existingBet] = await Promise.all([
            matchService.findOneById(bet.matchId),
            this.findOneById(bet.id),
        ]);

        if (bet.userId != existingBet.userId){
            throw new Error('Você não pode alterar a aposta de outro usuário, seu sujo.');
        }

        if (dayjs().isSameOrAfter(match.matchDate)){
            throw new Error('Você não pode alterar a aposta de uma partida que já iniciou.');
        }

        if(!bet.id || !bet.scoreA || !bet.scoreB) {
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

        return Math.imul(basePoints, weights[matchType]);
    }

    calculatePoints = (bet: BetResponse, match: MatchData) => {
        const points = [];
        const ONE_TEAM_SCORE = 1;
        const WINNER_OR_DRAW = 2;
        const EXACT_SCORE = 3;

       if (this.correctOneTeamScore(bet, match)){
            points.push(ONE_TEAM_SCORE);
        }

       if (this.correctResult(bet, match)) {
            points.push(WINNER_OR_DRAW);
       }

       if (this.correctBothScore(bet, match)) {
            points.push(EXACT_SCORE);
       }

        return points.reduce((prev: number, current: number) => prev + this.applyWeightByRound(current, match.type), 0);
    }

    getStatus = (bet: BetResponse, match: MatchData) => {
       const totalPoints = bet.scoreA && bet.scoreB ? this.calculatePoints(bet, match) : 0;
       const canEdit = dayjs().isBefore(match.matchDate) && !match.scoreA && !match.scoreB;

       return {
            totalPoints,
            canEdit,
       };
    }
}

export const betService = new BetService();
