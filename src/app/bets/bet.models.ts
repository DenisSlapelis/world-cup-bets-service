import { RowDataPacket } from 'mysql2';

export interface IBet extends RowDataPacket {
    id: number;
    userId: number;
    matchId: number;
    scoreA?: number;
    scoreB?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BetResponse {
    id: number;
    userId: number;
    matchId: number;
    scoreA?: number;
    scoreB?: number;
}

export interface BetCreateDTO {
    matchId: number;
    scoreA: number;
    scoreB: number;
}

export interface BetUpdateDTO extends BetCreateDTO {
    id: number;
}

export enum BetScoresENUM {
    ONE_TEAM_SCORE = 1,
    WINNER_OR_DRAW = 2,
    EXACT_SCORE = 3,
}
