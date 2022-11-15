import { RowDataPacket } from 'mysql2';

export interface TeamResponse extends RowDataPacket {
    id: number;
    name: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
