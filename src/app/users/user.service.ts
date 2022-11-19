import { UserDTO, UserResponse, UserUpdateDTO } from './user.models';
import { database } from '@database';
import { matchService } from '@app/matches/match.service';
import dayjs = require('dayjs');
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { MatchResponse, MatchTypeENUM, MatchTypeWeightsENUM } from '@app/matches/match.models';

export class UserService {
    constructor() {
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.extend(isSameOrAfter);
    }

    findAllByUser = async (id: number): Promise<Array<UserResponse>> => {
        return database.execute<UserResponse[]>(`
            SELECT
                id,
                google_user_id AS googleUserId,
                name AS name,
                avatar AS avatar,
            FROM
                user
            WHERE
                id = ?
        `, [id]);
    };

    findOneById = async (id: number): Promise<UserResponse> => {
        const [result] = await database.execute<UserResponse[]>(`
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

    create = async (user: UserDTO): Promise<void> => {
        await this.checkCreateValidations(user);

        const sql = 'INSERT INTO `user` (google_user_id, name, avatar) VALUES (?, ?, ?)';

        const { googleUserId, name, avatar } = user;

        await database.execute(sql, [googleUserId, name, avatar]);
    };

    checkCreateValidations = async (user: UserDTO) => {
        const match = await matchService.findOneById(user.id);

        if (dayjs().isSameOrAfter(match.matchDate)){
            throw new Error('Você não pode apostar em uma partida que já iniciou.');
        }
    }

    update = async (user: UserUpdateDTO): Promise<void> => {
        await this.checkUpdateValidations(user);

        const sql = 'UPDATE bet SET score_a = ?, score_b = ? WHERE id = ?';

        const { betId, scoreA, scoreB } = user;

        await database.execute(sql, [scoreA, scoreB, betId]);
    };

    checkUpdateValidations = async (user: UserUpdateDTO) => {
        const match = await matchService.findOneById(user.matchId);
        const existingBet = await this.findOneById(user.betId);

        if (user.userId !== existingBet.userId){
            throw new Error('Você não pode alterar a aposta de outro usuário, seu sujo.');
        }

        if (dayjs().isSameOrAfter(match.matchDate)){
            throw new Error('Você não pode alterar a aposta de uma partida que já iniciou.');
        }
    }

    calculateWinner = (data: Partial<UserResponse>) => {
        const winnerA = data.scoreA! > data.scoreB!;
        const winnerB = data.scoreB! > data.scoreA!;

        if(winnerA) return 'WINNER_A';
        if(winnerB) return 'WINNER_B';

        return 'DRAW';
    }

    correctResult = (bet: UserResponse, match: MatchResponse) => {
        const betWinner = this.calculateWinner(bet);
        const matchWinner = this.calculateWinner(match);

        return betWinner === matchWinner;
    }

    correctOneTeamScore = (bet: UserResponse, match: MatchResponse) => {
        const correctScoreA = bet.scoreA === match.scoreA;
        const correctScoreB = bet.scoreB === match.scoreB;

        return (correctScoreA && !correctScoreB) || (!correctScoreA && correctScoreB);
    }

    correctBothScore = (bet: UserResponse, match: MatchResponse) => {
        const correctScoreA = bet.scoreA === match.scoreA;
        const correctScoreB = bet.scoreB === match.scoreB;

        return correctScoreA && correctScoreB;
    }

    applyWeightByRound = (basePoints: number, matchType: MatchTypeENUM) => {
        const weights = {...MatchTypeWeightsENUM};

        return Math.imul(basePoints, weights[matchType]);
    }

    calculatePoints = (bet: UserResponse, match: MatchResponse) => {
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

    getStatus = (bet: UserResponse, match: MatchResponse) => {
       const totalPoints = this.calculatePoints(bet, match);
       const canEdit = dayjs().isBefore(match.matchDate) && !match.scoreA && !match.scoreB;

       return {
            totalPoints,
            canEdit,
       };
    }
}

export const userService = new UserService();
