import { Router } from 'express';
import { RankingService, rankingService } from './ranking.service';
import { formatErrorResponse } from '../../routes/routes.utils';

export class RankingController {
    service: RankingService;
    routes: Router;
    routePath: string;

    constructor() {
        this.routePath = '/rankings';
        this.service = rankingService;
        this.routes = this.configRoutes();
    }

    private configRoutes() {
        const router = Router();

        router.get('/', this.getRanking);

        return router;
    }

    getRanking = async (req: any, res: any) => {
        try {
            const { reqUserId } = req.query;

            const result = await this.service.getRanking(reqUserId);

            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json(formatErrorResponse(err, res));
        }
    };
}

export const rankingController = new RankingController();
