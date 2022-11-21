import { userService } from '@app/users/user.service';
import Express from 'express';
import { PUBLIC_ROUTES } from './public-routes';

export const getUserMiddleware = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    const { path, method } = req;

    if(isPublicRoute(path, method)) {
        return next();
    }

    const auth = req?.headers['user-id'] || '';
    const googleUserId = Array.isArray(auth) ? auth[0] : auth;

    const userId = await userService.findOneByGoogleId(googleUserId);

    if (!userId) {
        return res.status(401).json({error: 'Unauthorized', message: 'Unauthorized User'});
    }

    req.query.userId = userId.id.toString();

    return next();
}

const isPublicRoute = (path: string, method: string) => {
    const publicPath = PUBLIC_ROUTES.hasOwnProperty(path);
    const publicPathMethod = PUBLIC_ROUTES[path]?.includes(method);

    return publicPath && publicPathMethod;
}
