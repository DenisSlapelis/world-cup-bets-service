import { Router } from 'express';
import { betService, BetService } from './bet.service';
import { formatErrorResponse } from '../../routes/routes.utils';

export class BetController {
    service: BetService;
    routes: Router;
    routePath: string;

    constructor() {
        this.routePath = '/bets';
        this.service = betService;
        this.routes = this.configRoutes();
    }

    private configRoutes() {
        const router = Router();

        router.post('/', this.create);
        router.post('/import', this.import);
        router.post('/recalculate', this.recalculatePoints);
        router.get('/', this.getBetsByUser);
        router.get('/:id', this.getById);
        router.patch('/', this.update);

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
            const userId = req.query.userId;

            req.body.userId = userId;

            const result = await this.service.create(req.body, userId);

            res.status(201).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    import = async (req: any, res: any) => {
        try {
            const userId = req.query.userId;

            await this.service.import(userId);

            res.status(201).json();
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
            const userId = req.query.userId;

            const { matchId } = req.query;

            const result = await this.service.findAllByUser(userId, matchId);

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    getById = async (req: any, res: any) => {
        try {
            const id = req.params.id;

            const result = await this.service.findOneById(id);

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };


    update = async (req: any, res: any) => {
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
            const userId = req.query.userId;

            const result = await this.service.update(req.body, userId);

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    recalculatePoints = async (req: any, res: any) => {
        try {
            const result = await this.service.recalcAllTotalPoints();

            res.status(201).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };
}

export const betController = new BetController();
