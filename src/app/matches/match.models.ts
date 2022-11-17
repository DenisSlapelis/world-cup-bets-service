import { BetResponse } from '@app/bets/bet.models';
import { RowDataPacket } from 'mysql2';

export enum MatchTypeENUM {
    GROUP_A = 'GROUP_A',
    GROUP_B = 'GROUP_B',
    GROUP_C = 'GROUP_C',
    GROUP_D = 'GROUP_D',
    GROUP_E = 'GROUP_E',
    GROUP_F = 'GROUP_F',
    GROUP_G = 'GROUP_G',
    GROUP_H = 'GROUP_H',
    ROUND_OF_16 = 'ROUND_OF_16',
    QUARTER_FINAL = 'QUARTER_FINAL',
    SEMI_FINAL = 'SEMI_FINAL',
    THIRD_PLACE = 'THIRD_PLACE',
    FINAL = 'FINAL',
}

export enum MatchTypeWeightsENUM {
    GROUP_A = 1,
    GROUP_B = 1,
    GROUP_C = 1,
    GROUP_D = 1,
    GROUP_E = 1,
    GROUP_F = 1,
    GROUP_G = 1,
    GROUP_H = 1,
    ROUND_OF_16 = 1.5,
    QUARTER_FINAL = 1.5,
    SEMI_FINAL = 2,
    THIRD_PLACE = 2.5,
    FINAL = 3,
}

export interface MatchResponse extends RowDataPacket {
    id: number;
    cupId: number;
    teamAId: number;
    teamBId: number;
    scoreA?: number;
    scoreB?: number;
    type: MatchTypeENUM;
    matchDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MatchResponseWithBets extends MatchResponse {
    bets: Array<BetResponse>;
}
