import { Router } from 'express';
// import * as swaggerUi from 'swagger-ui-express';
// import * as swaggerFile from '../swagger/swagger_output.json';
import { teamController } from '../app/teams/teams.controller';
import { betController } from '../app/bets/bet.controller';
import { matchController } from '../app/matches/match.controller';
import { userController } from '@app/users/user.controller';
import { rankingController } from '@app/rankings/ranking.controller';
import { cronController } from '@app/cron/cron.controller';

export const router = Router();

router.use(teamController.routePath, teamController.routes);
router.use(betController.routePath, betController.routes);
router.use(matchController.routePath, matchController.routes);
router.use(userController.routePath, userController.routes);
router.use(rankingController.routePath, rankingController.routes);
router.use(cronController.routePath, cronController.routes);
// router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
