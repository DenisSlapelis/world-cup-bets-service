import { RowDataPacket } from 'mysql2';

export interface ITeam extends RowDataPacket {
    id: number;
    name: string;
    tag: string;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TeamResponse {
    id: number;
    name: string;
    tag: string;
    avatar?: string;
}
