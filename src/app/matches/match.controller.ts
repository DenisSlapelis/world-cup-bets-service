import { Router } from 'express';
import { matchService, MatchService } from './match.service';
import { formatErrorResponse } from '../../routes/routes.utils';

export class MatchController {
    private service: MatchService;
    routes: Router;
    routePath: string;

    constructor() {
        this.routePath = '/matches'
        this.service = matchService;
        this.routes = this.configRoutes();
    }

    private configRoutes() {
        const router = Router();

        router.post('/', this.create);
        router.post('/sync', this.syncMatchResults);
        router.get('/', this.getAllMatchesByCupAndUser);
        router.get('/:id', this.getById);
        router.patch('/:id', this.updateById);

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
            const result = await this.service.create(req.body);

            res.status(201).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    getAllMatchesByCupAndUser = async (req: any, res: any) => {
        try {
            const filters = req.query;
            const { reqUserId } = filters;

            const result = await this.service.findAllByCup(reqUserId, filters);

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

    updateById = async (req: any, res: any) => {
        try {
            const id = req.params.id;

            const result = await this.service.update(id, req.body);

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    syncMatchResults = async (req: any, res: any) => {
        try {
            const result = await this.service.syncMatchResults();

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };
}

export const matchController = new MatchController();
