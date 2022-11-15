import { CustomError } from './routes.model';
import environment from '../environment/environment';

const respondRoot405 = (res: any) => {
    res.status(405).send("You can't request root. Choose another path.");
}

const formatErrorResponse = (err: any, res: any = {}): CustomError => {
    return {
        name: err.name ? err.name : 'Internal Error',
        message: err.message ? formatErrorMessage(res, err) : ['Internal Error'],
        stack: err.stack ? formatErrorStack(err.stack) : null,
        params: err.params ? err.params : [],
        status: err.status || 500,
    }
}

const formatErrorMessage = (res: any, error: any): Array<string> => {
    const { message, name } = error;
    const externalMessages = ['firestoreExecution'];
    const external = externalMessages.includes(name);

    if (Array.isArray(message))
        return message.map((errorMessage: string, idx: number) => external ? errorMessage : handleErrorMessage(errorMessage));
    else if (typeof message === 'string')
        return external ? [message] : [handleErrorMessage(message)];
    else
        return environment.nodeEnv === "develop" ? JSON.parse(message) : ['Internal Error'];
}

const formatErrorStack = (stack: any): string => {
    return environment.nodeEnv === "develop" ? stack : null;
}

const handleErrorMessage = (errorMessage: any): string => {
    return errorMessage ? errorMessage : 'Internal Error';
}

export {
    respondRoot405,
    formatErrorResponse,
};