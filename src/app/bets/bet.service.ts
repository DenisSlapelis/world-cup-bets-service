import { BetDTO, BetResponse, BetUpdateDTO } from './bet.models';
import { database } from '@database';
import { matchService } from '@app/matches/match.service';
import dayjs = require('dayjs');
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { MatchResponse, MatchTypeENUM, MatchTypeWeightsENUM } from '@app/matches/match.models';

export class BetService {
    constructor() {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.extend(isSameOrAfter);
    }

    findAllByUser = async (userId: number): Promise<Array<BetResponse>> => {
        return database.execute<BetResponse[]>(`
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
        `, [userId]);
    };

    findOneById = async (id: number): Promise<BetResponse> => {
        const [result] = await database.execute<BetResponse[]>(`
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

    create = async (bet: BetDTO): Promise<void> => {
        await this.checkCreateValidations(bet);

        const sql = 'INSERT INTO bet (user_id, match_id, score_a, score_b) VALUES (?, ?, ?, ?)';

        const { userId, matchId, scoreA, scoreB } = bet;

        await database.execute(sql, [userId, matchId, scoreA, scoreB]);
    };

    checkCreateValidations = async (bet: BetDTO) => {
        const match = await matchService.findOneById(bet.matchId);

        if (dayjs().isSameOrAfter(match.matchDate)){
            throw new Error('Você não pode apostar em uma partida que já iniciou.');
        }
    }

    update = async (bet: BetUpdateDTO): Promise<void> => {
        await this.checkUpdateValidations(bet);

        const sql = 'UPDATE bet SET score_a = ?, score_b = ? WHERE id = ?';

        const { betId, scoreA, scoreB } = bet;

        await database.execute(sql, [scoreA, scoreB, betId]);
    };

    checkUpdateValidations = async (bet: BetUpdateDTO) => {
        const match = await matchService.findOneById(bet.matchId);
        const existingBet = await this.findOneById(bet.betId);

        if (bet.userId !== existingBet.userId){
            throw new Error('Você não pode alterar a aposta de outro usuário, seu sujo.');
        }

        if (dayjs().isSameOrAfter(match.matchDate)){
            throw new Error('Você não pode alterar a aposta de uma partida que já iniciou.');
        }
    }

    calculateWinner = (data: Partial<BetResponse>) => {
        const winnerA = data.scoreA! > data.scoreB!;
        const winnerB = data.scoreB! > data.scoreA!;

        if(winnerA) return 'WINNER_A';
        if(winnerB) return 'WINNER_B';

        return 'DRAW';
    }

    correctResult = (bet: BetResponse, match: MatchResponse) => {
        const betWinner = this.calculateWinner(bet);
        const matchWinner = this.calculateWinner(match);

        return betWinner === matchWinner;
    }

    correctOneTeamScore = (bet: BetResponse, match: MatchResponse) => {
        const correctScoreA = bet.scoreA === match.scoreA;
        const correctScoreB = bet.scoreB === match.scoreB;

        return (correctScoreA && !correctScoreB) || (!correctScoreA && correctScoreB);
    }

    correctBothScore = (bet: BetResponse, match: MatchResponse) => {
        const correctScoreA = bet.scoreA === match.scoreA;
        const correctScoreB = bet.scoreB === match.scoreB;

        return correctScoreA && correctScoreB;
    }

    applyWeightByRound = (basePoints: number, matchType: MatchTypeENUM) => {
        const weights = {...MatchTypeWeightsENUM};

        return Math.imul(basePoints, weights[matchType]);
    }

    calculatePoints = (bet: BetResponse, match: MatchResponse) => {
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
            match.type
       }

        return points.reduce((prev: number, current: number) => prev + this.applyWeightByRound(current, match.type), 0);
    }

    getStatus = (bet: BetResponse, match: MatchResponse) => {
       const totalPoints = this.calculatePoints(bet, match);
       const canEdit = dayjs().isBefore(match.matchDate);

       return {
            totalPoints,
            canEdit,
       };
    }
}

export const betService = new BetService();
