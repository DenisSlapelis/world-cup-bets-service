import { RowDataPacket } from 'mysql2';

export interface UserResponse extends RowDataPacket {
    id: number;
    googleUserId: string;
    name: string;
    avatar: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserDTO {
    id: number;
    googleUserId: string;
    name: string;
    avatar: string;
}

export interface UserUpdateDTO extends UserDTO {
    userId: number;
}
