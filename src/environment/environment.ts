import * as dotenv from 'dotenv';
dotenv.config();

class Environment {
    private static instance: Environment;
    // Code execution vars
    listenMode: string | undefined;
    listenPort: string | undefined;
    nodeEnv: string | undefined;

    // External project conf vars
    keyFilename: string | undefined;

    /**
     * The Environment's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {
        // Code execution vars
        this.listenMode = process.env.LISTEN_MODE;
        this.listenPort = process.env.LISTEN_PORT;
        this.nodeEnv = process.env.NODE_ENV;

        // External project conf vars
        this.keyFilename = process.env.KEYFILENAME;
    }

    public static getInstance(): Environment {
        if (!Environment.instance) {
            Environment.instance = new Environment();
        }

        return Environment.instance;
    }
}

const environment = Environment.getInstance();

export default environment;
