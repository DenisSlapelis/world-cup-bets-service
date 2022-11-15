import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import environment from '@env';
// import * as routes from './routes';
import { logger, errorLogger } from '@logger';

const app = express();

// CORS
app.use(cors());

// JSON
app.use(express.json());

// Api logger.
app.use(logger);

// Api routes.
// app.use(routes.default);

// Api error logger.
app.use(errorLogger);

// Activate express listen mode.
if (environment.listenMode === 'TRUE') {
    const { listenPort: port } = environment;

    console.log(`\n== START LISTEN MODE ON PORT ${port}\n`);
    console.log(`== SWAGGER DOCUMENTATION CAN BE FOUND ON http://localhost:${port}/api/v1/doc/ \n`);

    app.listen(port);
}

console.log('== teste');

export const syncWatchLaterService = functions.https.onRequest(app);
