import { Router } from 'express';
import { userService, UserService } from './user.service';
import { formatErrorResponse } from '../../routes/routes.utils';

export class UserController {
    service: UserService;
    routes: Router;

    constructor() {
        this.service = userService;
        this.routes = this.configRoutes();
    }

    private configRoutes() {
        const router = Router();

        router.post('/', this.create);
        router.get('/', this.getUsers);
        router.get('/google-users/:id', this.getUserByGoogleId);
        router.get('/:id', this.getUserById);

        return router;
    }

    create = async (req: any, res: any) => {
        /*
            == Description
            #swagger.tags = ['User']
            #swagger.description = 'Creats a User.'
            #swagger.path = '/bets'

            == Successful response:
            #swagger.responses[201] = {
                schema: { $ref: "#/definitions/User" },
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

    getUsers = async (req: any, res: any) => {
        /*
            == Description
            #swagger.tags = ['User']
            #swagger.description = 'Get all Users.'
            #swagger.path = '/users'

            == Successful response:
            #swagger.responses[200] = {
                schema: { $ref: "#/definitions/User" },
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

    getUserByGoogleId = async (req: any, res: any) => {
        /*
            == Description
            #swagger.tags = ['User']
            #swagger.description = 'Get User by Google user id.'
            #swagger.path = '/users'

            == Successful response:
            #swagger.responses[200] = {
                schema: { $ref: "#/definitions/User" },
                description: 'JSON data'
            }

            == Error responses:
            #swagger.responses[500] = {
                schema: { $ref: "#/definitions/CustomError" },
                description: 'Unexpected error'
            }
        */

        try {
            const result = await this.service.findOneByGoogleId(req.params.id);

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    getUserById = async (req: any, res: any) => {
        /*
            == Description
            #swagger.tags = ['User']
            #swagger.description = 'Get user by id.'
            #swagger.path = '/users/:id'

            == Successful response:
            #swagger.responses[200] = {
                schema: { $ref: "#/definitions/User" },
                description: 'JSON data'
            }

            == Error responses:
            #swagger.responses[500] = {
                schema: { $ref: "#/definitions/CustomError" },
                description: 'Unexpected error'
            }
        */

        try {
            const result = await this.service.findOneById(1);

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };
}

export const userController = new UserController();
