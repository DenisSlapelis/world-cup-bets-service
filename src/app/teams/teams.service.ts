import { TeamResponse } from './teams.models';
import { database } from '../../database';
import { toCamelCase } from '@helpers';

export class TeamService {
    constructor() {}

    getTeams = async (): Promise<Array<TeamResponse>> => {
        const data = await database.execute('SELECT * FROM team');

        const result: Array<TeamResponse> = data.map((row) => toCamelCase(row));

        return result;
    };
}

export const teamService = new TeamService();
