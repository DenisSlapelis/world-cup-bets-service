import { RowDataPacket } from 'mysql2';

export interface IUser extends RowDataPacket {
    id: number;
    name: string;
    googleUserId: string;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserDTO {
    name: string;
    googleUserId: string;
    avatar?: string;
}
