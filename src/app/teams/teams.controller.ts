import { Router } from 'express';
import { teamService, TeamService } from './teams.service';
import { formatErrorResponse } from '../../routes/routes.utils';

export class TeamController {
    service: TeamService;
    routes: Router;

    constructor() {
        this.service = teamService;
        this.routes = this.configRoutes();
    }

    private configRoutes() {
        const router = Router();

        router.get('/', this.getTeams);

        return router;
    }

    getTeams = async (req: any, res: any) => {
        /*
            == Description
            #swagger.tags = ['Teaam']
            #swagger.description = 'Get all Teams.'
            #swagger.path = '/teams'

            == Successful response:
            #swagger.responses[200] = {
                schema: { $ref: "#/definitions/Team" },
                description: 'JSON data'
            }

            == Error responses:
            #swagger.responses[500] = {
                schema: { $ref: "#/definitions/CustomError" },
                description: 'Unexpected error'
            }
        */

        try {
            const result = await this.service.findAll();

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };
}

export const teamController = new TeamController();
