import { Router } from 'express';
import { matchService, MatchService } from './match.service';
import { formatErrorResponse } from '../../routes/routes.utils';

export class MatchController {
    private service: MatchService;
    routes: Router;

    constructor() {
        this.service = matchService;
        this.routes = this.configRoutes();
    }

    private configRoutes() {
        const router = Router();

        router.post('/', this.create);
        router.get('/', this.getAllMatchesByCupAndUser);

        return router;
    }

    create = async (req: any, res: any) => {
        /*
            == Description
            #swagger.tags = ['Match']
            #swagger.description = 'Creats a Match.'
            #swagger.path = '/matchs'

            == Successful response:
            #swagger.responses[201] = {
                schema: { $ref: "#/definitions/Match" },
                description: 'JSON data'
            }

            == Error responses:
            #swagger.responses[500] = {
                schema: { $ref: "#/definitions/CustomError" },
                description: 'Unexpected error'
            }
        */

        try {
            const result = await this.service.create();

            res.status(201).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    getAllMatchesByCupAndUser = async (req: any, res: any) => {
        /*
            == Description
            #swagger.tags = ['Match']
            #swagger.description = 'Get all Matchs.'
            #swagger.path = '/matchs'

            == Successful response:
            #swagger.responses[200] = {
                schema: { $ref: "#/definitions/Match" },
                description: 'JSON data'
            }

            == Error responses:
            #swagger.responses[500] = {
                schema: { $ref: "#/definitions/CustomError" },
                description: 'Unexpected error'
            }
        */

        try {
            const includeBets = !!(req.query?.includeBets);
            const userId = 1;

            const result = await this.service.findAllByCup(userId, includeBets);

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };
}

export const matchController = new MatchController();
