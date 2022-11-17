import { TeamResponse } from './teams.models';
import { database } from '../../database';

export class TeamService {
    constructor() {}

    getTeams = async (): Promise<Array<TeamResponse>> => {
        return database.execute<Array<TeamResponse>>(`
            SELECT
                id
                name
                avatar
            FROM
                team
        `);
    };
}

export const teamService = new TeamService();
