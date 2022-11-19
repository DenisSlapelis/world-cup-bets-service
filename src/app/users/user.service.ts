import { IUser, UserDTO } from './user.models';
import { database } from '../../database';

export class UserService {
    constructor() {}

    create = async (user: UserDTO) => {
        await this.checkCreateValidations(user);

        const sql = 'INSERT INTO `user` (google_user_id, name, avatar) VALUES (?, ?, ?)';

        const { googleUserId, name, avatar } = user;

        await database.execute(sql, [googleUserId, name, avatar]);
    }

    findAll = async (): Promise<Array<IUser>> => {
        return database.execute<Array<IUser>>(`
            SELECT
                id,
                name,
                google_user_id AS googleUserId,
                avatar
            FROM
                \`user\`
        `);
    };

    findOneByGoogleId = async (googleUserId: string): Promise<IUser> => {
        const [result] = await database.execute<Array<IUser>>(`
            SELECT
                id,
                name,
                google_user_id AS googleUserId,
                avatar
            FROM
                \`user\`
            WHERE
                google_user_id = ?
        `, [googleUserId]);

        return result;
    };

    findOneById = async (id: number): Promise<IUser> => {
        const [result] = await database.execute<Array<IUser>>(`
            SELECT
                id,
                name,
                google_user_id AS googleUserId,
                avatar
            FROM
                \`user\`
            WHERE
                id = ?
        `, [id]);

        return result;
    };

    checkCreateValidations = async (user: UserDTO) => {
        const _user = await this.findOneByGoogleId(user.googleUserId);

        if(_user) {
            throw new Error('Usuário já cadastrado');
        }
    }
}

export const userService = new UserService();
