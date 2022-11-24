import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import environment from '@env';
import { router as routes } from './routes';
import { logger, errorLogger } from '@logger';
import { getUserMiddleware } from './routes/middlewares';
import { cronService } from '@app/cron/cron.service';

const app = express();

// CORS
app.use(cors());

// JSON
app.use(express.json());

// Api logger.
app.use(logger);

// Api middlewares.
app.use(getUserMiddleware);

// Api routes.
app.use(routes);

// Api error logger.
app.use(errorLogger);

// Activate express listen mode.
if (environment.listenMode === 'TRUE') {
    const { listenPort: port } = environment;

    console.log(`\n== START LISTEN MODE ON PORT ${port}\n`);
    console.log(`== SWAGGER DOCUMENTATION CAN BE FOUND ON http://localhost:${port}/api/v1/doc/ \n`);

    app.listen(port);

    // start cron
    cronService.start();
}

export const syncWatchLaterService = functions.https.onRequest(app);
