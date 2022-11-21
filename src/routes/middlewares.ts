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
    const formattedPath = getPathWithoutRouteParams(path);

    const publicPath = PUBLIC_ROUTES.hasOwnProperty(formattedPath);

    const publicPathMethod = PUBLIC_ROUTES[formattedPath]?.includes(method);

    return publicPath && publicPathMethod;
}

const getPathWithoutRouteParams = (path: string) => {
    const publicRoutes = Object.keys(PUBLIC_ROUTES);

    let result = path;

    for (const route of publicRoutes) {
        const replacedPath = path.replace(route, '#');

        if (!replacedPath.includes('/')) {
            result = route;
            break;
        }
    }

    return result;
}
