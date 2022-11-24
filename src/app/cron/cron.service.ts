import { matchService } from '@app/matches/match.service';
import cron from 'node-cron';

const cronExpression: string = process.env.CRON_CONFIG || '* * * * *';

export class CronService {
    private _cron: cron.ScheduledTask;

    constructor() {
        this._cron = this.scheduledFunction();
    }

    start = () => {
        console.log('== START CRON');

        this._cron.start();
    };

    stop = () => {
        console.log('== STOP CRON');

        this._cron.stop();
    };

    scheduledFunction = () => {
        return cron.schedule(cronExpression, () => {
            console.log(`[${new Date().toISOString()}] SYNC MATCH RESULTS`);

            matchService.syncMatchResults().catch((err) => console.log('== ERRO AO SINCRONIZAR RESULTADOS: ', err));
        });
    };

    getConfig = () => cronExpression;
}

export const cronService = new CronService();
