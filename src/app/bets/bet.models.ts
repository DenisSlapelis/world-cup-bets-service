import { RowDataPacket } from 'mysql2';

export interface BetResponse extends RowDataPacket {
    id: number;
    userId: number;
    matchId: number;
    scoreA?: number;
    scoreB?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BetDTO {
    userId: number;
    matchId: number;
    scoreA: number;
    scoreB: number;
}

export interface BetUpdateDTO extends BetDTO {
    betId: number;
}
