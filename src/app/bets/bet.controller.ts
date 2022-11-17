import { Router } from 'express';
import { betService, BetService } from './bet.service';
import { formatErrorResponse } from '../../routes/routes.utils';

export class BetController {
    service: BetService;
    routes: Router;

    constructor() {
        this.service = betService;
        this.routes = this.configRoutes();
    }

    private configRoutes() {
        const router = Router();

        router.post('/', this.create);
        router.get('/', this.getBetsByUser);

        return router;
    }

    create = async (req: any, res: any) => {
        /*
            == Description
            #swagger.tags = ['Bet']
            #swagger.description = 'Creats a Bet.'
            #swagger.path = '/bets'

            == Successful response:
            #swagger.responses[201] = {
                schema: { $ref: "#/definitions/Bet" },
                description: 'JSON data'
            }

            == Error responses:
            #swagger.responses[500] = {
                schema: { $ref: "#/definitions/CustomError" },
                description: 'Unexpected error'
            }
        */

        try {
            const result = await this.service.create(req.body);

            res.status(201).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    getBetsByUser = async (req: any, res: any) => {
        /*
        == Description
        #swagger.tags = ['Bet']
        #swagger.description = 'Get all Bets.'
        #swagger.path = '/bets'

        == Successful response:
        #swagger.responses[200] = {
            schema: { $ref: "#/definitions/Bet" },
            description: 'JSON data'
        }

        == Error responses:
        #swagger.responses[500] = {
            schema: { $ref: "#/definitions/CustomError" },
            description: 'Unexpected error'
        }
    */

        try {
            const userId = 1;
            const result = await this.service.findAllByUser(userId);

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };
}

export const betController = new BetController();
