import * as dotenv from 'dotenv';
dotenv.config();

class Environment {
    private static instance: Environment;
    // Code execution
    listenMode: string | undefined;
    listenPort: string | undefined;
    nodeEnv: string | undefined;
    betChunkValue: number | null;
    cronConfig: string | undefined;

    // External project conf
    keyFilename: string | undefined;

    // Database
    databaseHost: string | undefined;
    databaseUsername: string | undefined;
    databasePassword: string | undefined;
    databaseName: string | undefined;

    // Scores API
    worldCupApi: string | undefined;

    // Gerencia Net
    gnApiUrl: string | undefined;
    gnClientId: string | undefined;
    gnClientSecret: string | undefined;
    gnCertificatePath: string | undefined;

    /**
     * The Environment's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {
        // Code execution
        this.listenMode = process.env.LISTEN_MODE;
        this.listenPort = process.env.PORT;
        this.nodeEnv = process.env.NODE_ENV;
        this.betChunkValue = Number(process.env.BET_CHUNK_VALUE) || null;
        this.cronConfig = process.env.CRON_CONFIG;

        // External project conf
        this.keyFilename = process.env.KEYFILENAME;

        // Database envs
        this.databaseHost = process.env.DATABASE_HOST;
        this.databaseUsername = process.env.DATABASE_USERNAME;
        this.databasePassword = process.env.DATABASE_PASSWORD;
        this.databaseName = process.env.DATABASE_NAME;

        // Scores API
        this.worldCupApi = process.env.WORLD_CUP_API;

        // Gerencia Net
        this.gnApiUrl = process.env.GN_API_URL;
        this.gnClientId = process.env.GN_CLIENT_ID;
        this.gnClientSecret = process.env.GN_CLIENT_SECRET;
        this.gnCertificatePath = process.env.GN_CERTIFICATE_PATH;
    }

    public static getInstance(): Environment {
        if (!Environment.instance) {
            Environment.instance = new Environment();
        }

        return Environment.instance;
    }
}

export const environment = Environment.getInstance();
