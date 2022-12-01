import { BetResponse } from '@app/bets/bet.models';
import { TeamResponse } from '@app/teams/teams.models';
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

export enum MatchTypeTitlesENUM {
    GROUP_A = 'Fase de Grupos',
    GROUP_B = 'Fase de Grupos',
    GROUP_C = 'Fase de Grupos',
    GROUP_D = 'Fase de Grupos',
    GROUP_E = 'Fase de Grupos',
    GROUP_F = 'Fase de Grupos',
    GROUP_G = 'Fase de Grupos',
    GROUP_H = 'Fase de Grupos',
    ROUND_OF_16 = 'Oitavas de Final',
    QUARTER_FINAL = 'Quartas de Final',
    SEMI_FINAL = 'Semifinal',
    THIRD_PLACE = 'Disputa do 3º lugar',
    FINAL = 'Final',
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

export interface IMatch extends RowDataPacket {
    id: number;
    cupId: number;
    teamIdA: number;
    teamIdB: number;
    scoreA?: number;
    scoreB?: number;
    type: MatchTypeENUM;
    matchDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface GeralMatchDB extends RowDataPacket {
    match_id: number;
    match_cup_id: number;
    match_score_a: number;
    match_score_b: number;
    match_type: MatchTypeENUM;
    match_date: Date;
    team_a_id: number;
    team_a_name: string;
    team_a_tag: string;
    team_a_avatar: string;
    team_b_id: number;
    team_b_name: string;
    team_b_tag: string;
    team_b_avatar: string;
    bet_id: number;
    bet_score_a: number;
    bet_score_b: number;
    user_id: number;
    user_google_id: string;
    user_avatar: string;
}

export interface MatchResponse {
    id: number;
    cupId: number;
    scoreA?: number;
    scoreB?: number;
    type: MatchTypeENUM;
    matchDate: Date;
    teamA: TeamResponse;
    teamB: TeamResponse;
    bet?: BetResponse;
}

export interface MatchData {
    id: number;
    cupId: number;
    teamIdA: number;
    teamIdB: number;
    scoreA?: number;
    scoreB?: number;
    type: MatchTypeENUM;
    matchDate: Date;
}

export interface MatchResponseGroupByType {
    [key: string]: Array<MatchResponse>;
}

export interface CreateMatchDTO {
    cupId: number;
    teamIdA: number;
    teamIdB: number;
    scoreA?: number;
    scoreB?: number;
    type: MatchTypeENUM;
    matchDate: Date;
}

export interface UpdateMatchDTO {
    scoreA?: number;
    scoreB?: number;
    matchDate?: Date;
}

export interface ConsolidatedMatchDTO {
    matchId: number;
    matchScoreA: number | null;
    matchScoreB: number | null;
    matchType: string;
    matchDate: Date;
    teamIdA: number;
    teamNameA: string;
    teamTagA: string;
    teamAvatarA: string;
    teamIdB: number;
    teamNameB: string;
    teamTagB: string;
    teamAvatarB: string;
    betId: number;
    betScoreA: number | null;
    betScoreB: number | null;
    totalPoints: number;
    canEdit: boolean;
    canShow: boolean;
}
