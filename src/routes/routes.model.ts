import environment from '../environment/environment';

interface ApiResponse<T> {
    result: T;
    error: ApiError;
}

interface ApiError {
    code?: number;
    type?: string;
    errors?: Array<ErrorDetail | string>;
}

interface ErrorDetail {
    code?: number;
    message?: string;
}

class CustomError {
    name: string;
    status: number;
    message: Array<string>;
    stack: string | undefined | null;
    params: Record<string, any>;
    constructor(message: any, status: number = 500, name?: string, params: Array<Record<string, any>> = []) {
        this.name = name || 'execution';
        if (Array.isArray(message))
            this.message = message;
        else if (typeof message === 'string') {
            this.message = [message];
        } else {
            this.message = JSON.parse(message);
        }
        this.message = Array.isArray(message) ? message : [message];
        this.stack = environment.nodeEnv === "develop" ? (new Error()).stack : null;
        this.params = params;
        this.status = status;
    }
}

export { ApiResponse, ApiError, CustomError };