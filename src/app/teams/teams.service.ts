import { TeamResponse } from './teams.models';
import { database } from '../../database';

export class TeamService {
    constructor() {}

    findAll = async (): Promise<Array<TeamResponse>> => {
        return database.execute<Array<TeamResponse>>(`
            SELECT
                id,
                name,
                tag,
                avatar
            FROM
                team
        `);
    };

    findOneById = async (id: number): Promise<TeamResponse> => {
        const [result] = await database.execute<Array<TeamResponse>>(`
            SELECT
                id,
                name,
                tag,
                avatar
            FROM
                team
            WHERE
                id = ?
        `, [id]);

        return result;
    };
}

export const teamService = new TeamService();
