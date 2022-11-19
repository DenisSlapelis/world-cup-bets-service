import { Router } from 'express';
// import * as swaggerUi from 'swagger-ui-express';
// import * as swaggerFile from '../swagger/swagger_output.json';
import { teamController } from '../app/teams/teams.controller';
import { betController } from '../app/bets/bet.controller';
import { matchController } from '../app/matches/match.controller';
import { userController } from '@app/users/user.controller';

export const router = Router();

router.use('/teams', teamController.routes);
router.use('/bets', betController.routes);
router.use('/matches', matchController.routes);
router.use('/users', userController.routes);
// router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
