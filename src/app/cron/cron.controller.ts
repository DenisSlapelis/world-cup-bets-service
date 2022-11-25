import { Router } from 'express';
import { formatErrorResponse } from '../../routes/routes.utils';
import { cronService, CronService } from './cron.service';

export class CronController {
    private service: CronService;
    routes: Router;
    routePath: string;

    constructor() {
        this.routePath = '/cron'
        this.service = cronService;
        this.routes = this.configRoutes();
    }

    private configRoutes() {
        const router = Router();

        router.post('/start', this.start);
        router.post('/stop', this.stop);
        router.get('/', this.getConfig);

        return router;
    }

    start = (req: any, res: any) => {
        try {
            this.service.start();

            res.status(200).json('CRON STARTED');
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    stop = (req: any, res: any) => {
        try {
            this.service.stop();

            res.status(200).json('CRON STOPPED');
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };

    getConfig = (req: any, res: any) => {
        try {
            const result = this.service.getConfig();

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };
}

export const cronController = new CronController();
