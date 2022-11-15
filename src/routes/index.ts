import { Router } from 'express';
import { router as routes } from './routes.controllers';

export const router = Router();

router.use('/api/v1', routes);
