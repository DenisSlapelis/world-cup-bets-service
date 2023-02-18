import express from 'express';
import cors from 'cors';
import { environment as env} from '@env';
import { router as routes } from './routes';
import { logger, errorLogger } from '@logger';
import { getUserMiddleware } from './routes/middlewares';
import { cronService } from '@app/cron/cron.service';
import { danielDaBahia } from '@constants';

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
if (env.listenMode === 'TRUE') {
    const { listenPort: port } = env;

    console.log(`\n== START LISTEN MODE ON PORT ${port}\n`);
    console.log(`== SWAGGER DOCUMENTATION CAN BE FOUND ON http://localhost:${port}/api/v1/doc/ \n`);

    app.listen(port);

    // start cron
    cronService.start();
}

console.log(`${danielDaBahia} \nBOM DIA MARCELO, INICIOU APLICAÇÃO`);
